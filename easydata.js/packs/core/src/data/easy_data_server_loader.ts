import { DataLoader, DataChunkDescriptor } from './data_loader';
import { EasyDataTable } from './easy_data_table';
import { DataContext } from './data_context';

export class EasyDataServerLoader implements DataLoader {
    constructor(protected context: DataContext) {
    }

    loadChunk(params: DataChunkDescriptor | any) {
        const url = this.context.resolveEndpoint('FetchData', 
            { sourceId: params.sourceId || this.context.getActiveEntity().id });
        delete params.sourceId;

        this.context.startProcess();
        const http = this.context.getHttpClient();
        return http.post(url, params)
            .then((result) => {
                const dataTable = new EasyDataTable({
                    chunkSize: 1000
                });

                const resultSet = result.resultSet;
                for(const col of resultSet.cols) {
                    dataTable.columns.add(col);
                }

                for(const row of resultSet.rows) {
                    dataTable.addRow(row);
                }
        
                let totalRecords = 0;
                if (result.meta && result.meta.totalRecords) {
                    totalRecords = result.meta.totalRecords;    
                }

                return {
                    table: dataTable,
                    total: totalRecords,
                    hasNext: !params.needTotal 
                        || params.offset + params.limit < totalRecords
                }
        
            })
            .finally(() => {
                this.context.endProcess();
            });
    }

}