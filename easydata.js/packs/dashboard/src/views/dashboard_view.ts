import { DataRow, i18n, utils as dataUtils, EasyDataTable } from '@easydata/core';
import { 
    DefaultDialogService, 
    DialogService, domel, EasyGrid, 
    GridCellRenderer, GridColumn, RowClickEvent 
} from '@easydata/ui';
import { DashboardViewOptions } from './dashboard_view_options'
import { getContainer } from  '../utils/container'
import { EasyDataToolbar } from './toolbar_view'
import { componentsObserver } from '../utils/observer'
import { data1 } from '../assets/data/data1'

const TBID = 'EasyDataToolbarContainer'

export class EasyDashboardView {

    private dlg: DialogService;

    private container : HTMLElement;

    private options: DashboardViewOptions = {
        container: '#EasyDashboardContainer'
    };


    constructor (options?: DashboardViewOptions) 
    {
        this.options = dataUtils.assignDeep(this.options, options || {});
        this.container = getContainer(this.options.container);

        this.dlg = new DefaultDialogService();
       
        this.render();

        componentsObserver(this.container)
    }

    private render() {
        const dashboard = domel('div')
            .toDOM();

        this.container.appendChild(dashboard);

        const toolbarContainer = domel('div')
            .addClass('toolbar')
            .id(TBID)
            .toDOM()

        dashboard.appendChild(toolbarContainer)

        const contentWrapper = domel("div")
            .id("content-wrapper")
            .addClass("content-wrapper")
            .toDOM()
        
        dashboard.appendChild(contentWrapper)
        
        new EasyDataToolbar({
            panels: [
                {
                    name: "Work",
                    buttons: [
                        {
                            caption: "Data Grid",
                            cls: "text-button grid-icon",
                            icon: `<img class='icon' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjQgNjQiPgogICAgPHBhdGggZD0iTSA3IDggQyA1LjM0NiA4IDQgOS4zNDYgNCAxMSBMIDQgNTMgQyA0IDU0LjY1NCA1LjM0NiA1NiA3IDU2IEwgNTcgNTYgQyA1OC42NTQgNTYgNjAgNTQuNjU0IDYwIDUzIEwgNjAgMTEgQyA2MCA5LjM0NiA1OC42NTQgOCA1NyA4IEwgNyA4IHogTSA3IDEwIEwgNTcgMTAgQyA1Ny41NTIgMTAgNTggMTAuNDQ5IDU4IDExIEwgNTggMTggTCA2IDE4IEwgNiAxMSBDIDYgMTAuNDQ5IDYuNDQ4IDEwIDcgMTAgeiBNIDkgMTIgQyA4LjQ0NyAxMiA4IDEyLjQ0OCA4IDEzIEwgOCAxNSBDIDggMTUuNTUyIDguNDQ3IDE2IDkgMTYgQyA5LjU1MyAxNiAxMCAxNS41NTIgMTAgMTUgTCAxMCAxMyBDIDEwIDEyLjQ0OCA5LjU1MyAxMiA5IDEyIHogTSAxNCAxMiBDIDEzLjQ0NyAxMiAxMyAxMi40NDggMTMgMTMgTCAxMyAxNSBDIDEzIDE1LjU1MiAxMy40NDcgMTYgMTQgMTYgQyAxNC41NTMgMTYgMTUgMTUuNTUyIDE1IDE1IEwgMTUgMTMgQyAxNSAxMi40NDggMTQuNTUzIDEyIDE0IDEyIHogTSAxOSAxMiBDIDE4LjQ0NyAxMiAxOCAxMi40NDggMTggMTMgTCAxOCAxNSBDIDE4IDE1LjU1MiAxOC40NDcgMTYgMTkgMTYgQyAxOS41NTMgMTYgMjAgMTUuNTUyIDIwIDE1IEwgMjAgMTMgQyAyMCAxMi40NDggMTkuNTUzIDEyIDE5IDEyIHogTSAyNCAxMiBDIDIzLjQ0NyAxMiAyMyAxMi40NDggMjMgMTMgTCAyMyAxNSBDIDIzIDE1LjU1MiAyMy40NDcgMTYgMjQgMTYgQyAyNC41NTMgMTYgMjUgMTUuNTUyIDI1IDE1IEwgMjUgMTMgQyAyNSAxMi40NDggMjQuNTUzIDEyIDI0IDEyIHogTSAyOSAxMiBDIDI4LjQ0NyAxMiAyOCAxMi40NDggMjggMTMgTCAyOCAxNSBDIDI4IDE1LjU1MiAyOC40NDcgMTYgMjkgMTYgQyAyOS41NTMgMTYgMzAgMTUuNTUyIDMwIDE1IEwgMzAgMTMgQyAzMCAxMi40NDggMjkuNTUzIDEyIDI5IDEyIHogTSAzNCAxMiBDIDMzLjQ0NyAxMiAzMyAxMi40NDggMzMgMTMgTCAzMyAxNSBDIDMzIDE1LjU1MiAzMy40NDcgMTYgMzQgMTYgQyAzNC41NTMgMTYgMzUgMTUuNTUyIDM1IDE1IEwgMzUgMTMgQyAzNSAxMi40NDggMzQuNTUzIDEyIDM0IDEyIHogTSAzOSAxMiBDIDM4LjQ0NyAxMiAzOCAxMi40NDggMzggMTMgTCAzOCAxNSBDIDM4IDE1LjU1MiAzOC40NDcgMTYgMzkgMTYgQyAzOS41NTMgMTYgNDAgMTUuNTUyIDQwIDE1IEwgNDAgMTMgQyA0MCAxMi40NDggMzkuNTUzIDEyIDM5IDEyIHogTSA0NCAxMiBDIDQzLjQ0NyAxMiA0MyAxMi40NDggNDMgMTMgTCA0MyAxNSBDIDQzIDE1LjU1MiA0My40NDcgMTYgNDQgMTYgQyA0NC41NTMgMTYgNDUgMTUuNTUyIDQ1IDE1IEwgNDUgMTMgQyA0NSAxMi40NDggNDQuNTUzIDEyIDQ0IDEyIHogTSA0OSAxMiBDIDQ4LjQ0NyAxMiA0OCAxMi40NDggNDggMTMgTCA0OCAxNSBDIDQ4IDE1LjU1MiA0OC40NDcgMTYgNDkgMTYgQyA0OS41NTMgMTYgNTAgMTUuNTUyIDUwIDE1IEwgNTAgMTMgQyA1MCAxMi40NDggNDkuNTUzIDEyIDQ5IDEyIHogTSA1NCAxMiBDIDUzLjQ0NyAxMiA1MyAxMi40NDggNTMgMTMgTCA1MyAxNSBDIDUzIDE1LjU1MiA1My40NDcgMTYgNTQgMTYgQyA1NC41NTMgMTYgNTUgMTUuNTUyIDU1IDE1IEwgNTUgMTMgQyA1NSAxMi40NDggNTQuNTUzIDEyIDU0IDEyIHogTSA2IDIwIEwgNTggMjAgTCA1OCA1MyBDIDU4IDUzLjU1MSA1Ny41NTIgNTQgNTcgNTQgTCA3IDU0IEMgNi40NDggNTQgNiA1My41NTEgNiA1MyBMIDYgMjAgeiBNIDEyIDI0LjEyMTA5NCBDIDEwLjg5NyAyNC4xMjEwOTQgMTAgMjUuMDE4MDk0IDEwIDI2LjEyMTA5NCBMIDEwIDMyLjEyMTA5NCBDIDEwIDMzLjIyNDA5NCAxMC44OTcgMzQuMTIxMDk0IDEyIDM0LjEyMTA5NCBMIDIwIDM0LjEyMTA5NCBDIDIxLjEwMyAzNC4xMjEwOTQgMjIgMzMuMjI0MDk0IDIyIDMyLjEyMTA5NCBMIDIyIDI2LjEyMTA5NCBDIDIyIDI1LjAxODA5NCAyMS4xMDMgMjQuMTIxMDk0IDIwIDI0LjEyMTA5NCBMIDEyIDI0LjEyMTA5NCB6IE0gMjggMjQuMTIxMDk0IEMgMjYuODk3IDI0LjEyMTA5NCAyNiAyNS4wMTgwOTQgMjYgMjYuMTIxMDk0IEwgMjYgMzIuMTIxMDk0IEMgMjYgMzMuMjI0MDk0IDI2Ljg5NyAzNC4xMjEwOTQgMjggMzQuMTIxMDk0IEwgMzYgMzQuMTIxMDk0IEMgMzcuMTAzIDM0LjEyMTA5NCAzOCAzMy4yMjQwOTQgMzggMzIuMTIxMDk0IEwgMzggMjYuMTIxMDk0IEMgMzggMjUuMDE4MDk0IDM3LjEwMyAyNC4xMjEwOTQgMzYgMjQuMTIxMDk0IEwgMjggMjQuMTIxMDk0IHogTSA0NCAyNC4xMjEwOTQgQyA0Mi44OTcgMjQuMTIxMDk0IDQyIDI1LjAxODA5NCA0MiAyNi4xMjEwOTQgTCA0MiAzMi4xMjEwOTQgQyA0MiAzMy4yMjQwOTQgNDIuODk3IDM0LjEyMTA5NCA0NCAzNC4xMjEwOTQgTCA1MiAzNC4xMjEwOTQgQyA1My4xMDMgMzQuMTIxMDk0IDU0IDMzLjIyNDA5NCA1NCAzMi4xMjEwOTQgTCA1NCAyNi4xMjEwOTQgQyA1NCAyNS4wMTgwOTQgNTMuMTAzIDI0LjEyMTA5NCA1MiAyNC4xMjEwOTQgTCA0NCAyNC4xMjEwOTQgeiBNIDEyIDI2LjEyMTA5NCBMIDIwIDI2LjEyMTA5NCBMIDIwLjAwMTk1MyAzMi4xMjEwOTQgTCAxMiAzMi4xMjEwOTQgTCAxMiAyNi4xMjEwOTQgeiBNIDI4IDI2LjEyMTA5NCBMIDM2IDI2LjEyMTA5NCBMIDM2LjAwMTk1MyAzMi4xMjEwOTQgTCAyOCAzMi4xMjEwOTQgTCAyOCAyNi4xMjEwOTQgeiBNIDQ0IDI2LjEyMTA5NCBMIDUyIDI2LjEyMTA5NCBMIDUyLjAwMTk1MyAzMi4xMjEwOTQgTCA0NCAzMi4xMjEwOTQgTCA0NCAyNi4xMjEwOTQgeiBNIDEyIDM4LjEyMTA5NCBDIDEwLjg5NyAzOC4xMjEwOTQgMTAgMzkuMDE4MDk0IDEwIDQwLjEyMTA5NCBMIDEwIDQ2LjEyMTA5NCBDIDEwIDQ3LjIyNDA5NCAxMC44OTcgNDguMTIxMDk0IDEyIDQ4LjEyMTA5NCBMIDIwIDQ4LjEyMTA5NCBDIDIxLjEwMyA0OC4xMjEwOTQgMjIgNDcuMjI0MDk0IDIyIDQ2LjEyMTA5NCBMIDIyIDQwLjEyMTA5NCBDIDIyIDM5LjAxODA5NCAyMS4xMDMgMzguMTIxMDk0IDIwIDM4LjEyMTA5NCBMIDEyIDM4LjEyMTA5NCB6IE0gMjggMzguMTIxMDk0IEMgMjYuODk3IDM4LjEyMTA5NCAyNiAzOS4wMTgwOTQgMjYgNDAuMTIxMDk0IEwgMjYgNDYuMTIxMDk0IEMgMjYgNDcuMjI0MDk0IDI2Ljg5NyA0OC4xMjEwOTQgMjggNDguMTIxMDk0IEwgMzYgNDguMTIxMDk0IEMgMzcuMTAzIDQ4LjEyMTA5NCAzOCA0Ny4yMjQwOTQgMzggNDYuMTIxMDk0IEwgMzggNDAuMTIxMDk0IEMgMzggMzkuMDE4MDk0IDM3LjEwMyAzOC4xMjEwOTQgMzYgMzguMTIxMDk0IEwgMjggMzguMTIxMDk0IHogTSA0NCAzOC4xMjEwOTQgQyA0Mi44OTcgMzguMTIxMDk0IDQyIDM5LjAxODA5NCA0MiA0MC4xMjEwOTQgTCA0MiA0Ni4xMjEwOTQgQyA0MiA0Ny4yMjQwOTQgNDIuODk3IDQ4LjEyMTA5NCA0NCA0OC4xMjEwOTQgTCA1MiA0OC4xMjEwOTQgQyA1My4xMDMgNDguMTIxMDk0IDU0IDQ3LjIyNDA5NCA1NCA0Ni4xMjEwOTQgTCA1NCA0MC4xMjEwOTQgQyA1NCAzOS4wMTgwOTQgNTMuMTAzIDM4LjEyMTA5NCA1MiAzOC4xMjEwOTQgTCA0NCAzOC4xMjEwOTQgeiBNIDEyIDQwLjEyMTA5NCBMIDIwIDQwLjEyMTA5NCBMIDIwLjAwMTk1MyA0Ni4xMjEwOTQgTCAxMiA0Ni4xMjEwOTQgTCAxMiA0MC4xMjEwOTQgeiBNIDI4IDQwLjEyMTA5NCBMIDM2IDQwLjEyMTA5NCBMIDM2LjAwMTk1MyA0Ni4xMjEwOTQgTCAyOCA0Ni4xMjEwOTQgTCAyOCA0MC4xMjEwOTQgeiBNIDQ0IDQwLjEyMTA5NCBMIDUyIDQwLjEyMTA5NCBMIDUyLjAwMTk1MyA0Ni4xMjEwOTQgTCA0NCA0Ni4xMjEwOTQgTCA0NCA0MC4xMjEwOTQgeiIvPgo8L3N2Zz4K'/>`,
                            onclick: () => {
                                console.log('Data1', data1);
                                const dataTable = new EasyDataTable({
                                    inMemory: true,
                                    columns: data1.resultSet.cols,
                                    rows: data1.resultSet.rows
                                });
                                
                                const gridOptions = {}
                                const grid = new EasyGrid(dataUtils.assignDeep({
                                    slot: "#content-wrapper",
                                    dataTable,
                                    paging: {
                                        pageSize: 15,
                                        allowPageSizeChange: true,
                                        pageSizeItems: [15, 30, 50, 100, 200]
                                    },
                                    showPlusButton: false,
                                    plusButtonTitle: i18n.getText('AddRecordBtnTitle'),
                                    showActiveRow: false
                                }, gridOptions || {}))
                            }
                        },
                        {
                            caption: "Pie Chart",
                            cls: "text-button disabled",
                            icon: `<img class='icon' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBkPSJNNDMuMDA5LDcuNjg2QzQzLjAwOCw3LjY4Niw0My4wMDgsNy42ODYsNDMuMDA5LDcuNjg2Yy0wLjAwMS0wLjAwMS0wLjAwMi0wLjAwMS0wLjAwMi0wLjAwMkMzOC40NTUsMi45NTMsMzIuMDY4LDAsMjUsMCBDMTEuMjE1LDAsMCwxMS4yMTUsMCwyNXMxMS4yMTUsMjUsMjUsMjVzMjUtMTEuMjE1LDI1LTI1QzUwLDE4LjI4NCw0Ny4zMzMsMTIuMTgzLDQzLjAwOSw3LjY4NnogTTMzLjIwNCwzLjUxOEwyNiwxMC43MjNWNy41MjcgYzAuMDIyLTAuMDE5LDAuMDUtMC4wMjUsMC4wNy0wLjA0Nmw0LjczNS00LjczN0MzMS42MjUsMi45NTgsMzIuNDI0LDMuMjE5LDMzLjIwNCwzLjUxOHogTTM3LjIwNSw1LjUxOUwyNi41NzYsMTYuMTQ3IGMtMC4xOS0wLjAzNC0wLjM4Mi0wLjA2Ni0wLjU3Ni0wLjA4OHYtMi41MDhsOS4xNzItOS4xNzJDMzUuODcsNC43MjUsMzYuNTQ4LDUuMTA2LDM3LjIwNSw1LjUxOXogTTQwLjg1OCw4LjM2NUwzMC43NSwxOC4wODMgYy0wLjYwOS0wLjUwNy0xLjI5LTAuOTMtMi4wMTktMS4yNjRMMzguODc4LDYuNjc0QzM5LjU3LDcuMiw0MC4yMjksNy43NjYsNDAuODU4LDguMzY1eiBNMjYsNC43MjNWMi4wMjUgYzAuODMyLDAuMDM2LDEuNjU0LDAuMTEzLDIuNDYxLDAuMjM1TDI2LDQuNzIzeiBNMjUsMThjMy44NTksMCw3LDMuMTQsNyw3YzAsMy44NTktMy4xNDEsNy03LDdjLTMuODYsMC03LTMuMTQxLTctNyBDMTgsMjEuMTQsMjEuMTQsMTgsMjUsMTh6IE0yLDI1QzIsMTIuNjUzLDExLjc4LDIuNTUxLDI0LDIuMDI1djE0LjAzNGMtNC40OTMsMC41LTgsNC4zMTctOCw4Ljk0MWMwLDQuOTYzLDQuMDM4LDksOSw5IGMyLjEyMiwwLDQuMDcxLTAuNzQyLDUuNjExLTEuOTc1bDkuOTIxLDkuOTIxQzM2LjQzNyw0NS43MDMsMzAuOTgyLDQ4LDI1LDQ4QzEyLjMxOCw0OCwyLDM3LjY4MywyLDI1eiIvPgo8L3N2Zz4K'/>`,
                        },
                        {
                            caption: "Bar Chart",
                            cls: "text-button disabled",
                            icon: `<img class='icon' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LWFsaWduOnN0YXJ0O2xpbmUtaGVpZ2h0Om5vcm1hbDt0ZXh0LXRyYW5zZm9ybTpub25lO2Jsb2NrLXByb2dyZXNzaW9uOnRiOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246Qml0c3RyZWFtIFZlcmEgU2FucyIgZD0iTSAzNCA0IEwgMzQgNSBMIDM0IDQ5IEwgMzQgNTAgTCAzNSA1MCBMIDQ3IDUwIEwgNDggNTAgTCA0OCA0OSBMIDQ4IDUgTCA0OCA0IEwgNDcgNCBMIDM1IDQgTCAzNCA0IHogTSAzNiA2IEwgNDYgNiBMIDQ2IDQ4IEwgMzYgNDggTCAzNiA2IHogTSAyIDE3IEwgMiAxOCBMIDIgNDkgTCAyIDUwIEwgMyA1MCBMIDE1IDUwIEwgMTYgNTAgTCAxNiA0OSBMIDE2IDE4IEwgMTYgMTcgTCAxNSAxNyBMIDMgMTcgTCAyIDE3IHogTSA0IDE5IEwgMTQgMTkgTCAxNCA0OCBMIDQgNDggTCA0IDE5IHogTSAxOCAyOCBMIDE4IDI5IEwgMTggNDkgTCAxOCA1MCBMIDE5IDUwIEwgMzEgNTAgTCAzMiA1MCBMIDMyIDQ5IEwgMzIgMjkgTCAzMiAyOCBMIDMxIDI4IEwgMTkgMjggTCAxOCAyOCB6IE0gMjAgMzAgTCAzMCAzMCBMIDMwIDQ4IEwgMjAgNDggTCAyMCAzMCB6IiBvdmVyZmxvdz0idmlzaWJsZSIgZW5hYmxlLWJhY2tncm91bmQ9ImFjY3VtdWxhdGUiIGZvbnQtZmFtaWx5PSJCaXRzdHJlYW0gVmVyYSBTYW5zIi8+Cjwvc3ZnPgo='/>`,
                        }
                    ]
                }
            ]
        })
   }
}