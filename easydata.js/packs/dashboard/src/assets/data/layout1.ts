import {data1} from "./data1";

export const Layout1 = {
    "meta": {},
    "widgets": [
        {
            "title": "Title Grid1",
            "class": "DataGrid",
            "style": "p-2",
            "dataset": data1,
            "options": {
            },
            "footer": "Footer for grid1"
        },
        {
            "title": "Title Grid2",
            "class": "DataGrid",
            "style": "p-2 cell-one-half",
            "dataset": data1,
            "options": {
            },
            "footer": "Footer for grid2"
        },
        {
            "title": "Bar Chart",
            "class": "Chart",
            "lib": "ChartJS",
            "style": "p-2 cell-one-half",
            "dataset": data1,
            "options": {
                type: 'bar',
                data: {
                    datasets: [{
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            },
            "footer": "Footer for chart"
        }
    ]
}