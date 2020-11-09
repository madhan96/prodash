var shotdata = [
    { id: 456, shot_name: 'shot_456', description: 'shot first project', in: 456, out: 560, frames: 104, client_bid: 4, client_date: '12-24-2020' },
    { id: 46, shot_name: 'shot_46', description: 'shot first project', in: 306, out: 560, frames: 610, client_bid: 4, client_date: '12-24-2020' }
];
var editedcell;
(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    var prodata = [
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Atcj', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },

        { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Roto', shots: 350 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },
        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },

        { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 },

    ];



    $('#confirm-modal').on('shown.bs.modal', function (e) {
        $('#rejectbutton').focus();

    })
    $('#confirm-modal').on('hidden.bs.modal', function (e) {
        if (editedcell !== undefined) {
            editedcell.reject()
        }

    })
    const confirmCellEdited = (cell) => {
        if (cell.getRow().getData().id === undefined) return
        $('.confirm-dlg-body').append(`Are you sure you want to change data from ${cell.getOldValue()} to ${cell.getValue()}`)
        $('#confirm-modal').modal('show');

        var res, rej;
        editedcell = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });

        editedcell.resolve = res;
        editedcell.reject = rej;
        res = undefined; rej = undefined;
        console.log(window.editedcell);
        editedcell.then(() => {
            cell.edit();
            editedcell = undefined;
            console.log(shottable.getRow(1));
            $('.confirm-dlg-body').html('');
            $('#confirm-modal').modal('hide')

        }
        ).catch(err => { cell.restoreOldValue(); cell.edit(); editedcell = undefined; $('.confirm-dlg-body').html(''); $('#confirm-modal').modal('hide'); console.error(err); })
    }


    $('#confirmbutton').on('click', function (event) {
        editedcell.resolve();
    })
    $('#rejectbutton').on('click', function (event) {
        editedcell.reject();
    })

    var printIcon = function (cell, formatterParams, onRendered) { //plain text value
        console.log(Object.keys(cell.getRow().getData()).length + "herre")
        console.log(cell.getRow().getData().id === undefined);
        return cell.getRow().getData().id !== undefined ? "<i class='fas fa-trash'></i>" : "<i class='fas fa-plus-square'></i>"
    };

    var dateEditor = function (cell, onRendered, success, cancel) {
        //cell - the cell component for the editable cell
        //onRendered - function to call when the editor has been rendered
        //success - function to call to pass the successfuly updated value to Tabulator
        //cancel - function to call to abort the edit and return to a normal cell

        //create and style input
        var cellValue = cell.getValue(),
            input = document.createElement("input");

        input.setAttribute("type", "date");

        input.style.padding = "4px";
        input.style.width = "100%";
        input.style.boxSizing = "border-box";

        input.value = cellValue;

        onRendered(function () {
            input.focus();
            input.style.height = "100%";
        });

        function onChange() {
            if (input.value != cellValue) {
                success(input.value);
            } else {
                cancel();
            }
        }

        //submit new value on blur or change
        input.addEventListener("blur", onChange);

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.code == 13) {
                onChange();
            }

            if (e.code == 27) {
                cancel();
            }
        });

        return input;
    };


    var shottable;
    const drawtable = (data) => {
        shottable = new Tabulator("#project-table", {

            data: prodata,
            pagination: "local",
            paginationSize: 10,
            paginationSizeSelector: [5, 10, 25],
            layout: "fitDataTable",
            movableRows: true,
            columns: [
                { title: "Id", field: "id", width: 100 },
                {
                    title: "Project Name", field: "project_name", width: 150, editor: "input", formatter: function (cell, formatterParams) {
                        var value = cell.getValue();

                        return value ? "<a style='color:rgb(6, 150, 215);font-weight:bold;' href='projectPlan.html'>" + value + "</a>" : '';

                    }, editorParams: {

                        search: true,
                        elementAttributes: {
                            maxlength: "50",
                            //set the maximum character length of the input element to 10 characters
                        }
                    },
                    cellEdited: confirmCellEdited,
                },

                {
                    title: "Client", field: "client", width: 150, editor: "input", editorParams: {

                        search: true,
                        elementAttributes: {
                            maxlength: "50",
                            //set the maximum character length of the input element to 10 characters
                        }
                    },
                    cellEdited: confirmCellEdited,


                },
                {
                    title: "Location", field: "location", width: 150, editor: "input", editorParams: {

                        search: true,
                        elementAttributes: {
                            maxlength: "50",
                            //set the maximum character length of the input element to 10 characters
                        }
                    },
                    cellEdited: confirmCellEdited,
                },
                { title: "Start Date", field: "start_date", width: 150, editor: dateEditor },
                { title: "End Date", field: "end_date", width: 150, editor: dateEditor },
                {
                    title: "Department", field: "department", width: 100, editor: "select", editorParams: {
                        values:
                        {
                            "PAINT": "Paint",
                            "MATCH": "Match",
                            "ROTO": "Roto",
                            "COMP": "Comp",
                            "3D": "3-d",
                            "FX": "Fx",
                        }
                        , verticalNavigation: "hybrid"
                    }
                },
                // { title: "Total Shots", field: "shots", width: 100, editor: "number", editorparams: { min: 0, verticalNavigation: "table", } },

                {
                    title: "Action", formatter: printIcon, width: 80, hozAlign: "center", cellClick: actProjectRow

                },


            ]
        })
        shottable.setData(data);
    }
    // drawtable(prodata);

    $('#add-row').focus()
    $('#add-row').on('click', (e) => {
        // shottable.setData().then(() => { shottable.addRow({}); });
        getProjectData((data) => {
            shottable.setData().then(() => { shottable.addRow({}); });
        })

    })
    const actProjectRow = (e, cell) => {
        if (cell.getRow().getData().id) {

            deleteProjectData(cell.getRow.getData(), (data) => {
                shottable.setData(data);
            });
        } else {
            let form_data = new FormData();
            let data = cell.getRow().getData()
            for (var key in data) {
                form_data.append(key, data[key]);
            }
            addProjectdata(form_data, () => {
                shottable.setData(data);
            })
        }
    }

    getProjectData(drawtable);

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();
    var $form = $('.box');
    if (isAdvancedUpload) {
        $form.addClass('has-advanced-upload');
        var droppedFile = false;

        $form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
            .on('dragover dragenter', function () {
                $form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function () {
                $form.removeClass('is-dragover');
            })
            .on('drop', function (e) {
                droppedFile = e.originalEvent.dataTransfer.files[0];
                showFile(droppedFile);
            });

    }
    var $input = $form.find('input[type="file"]'),
        $label = $form.find('label'),
        showFile = function (file) {
            $label.text(file.name);
        };

    $input.on('change', function (e) {
        showFiles(e.target.files[0]);
    });
    $form.on('submit', function (e) {
        if ($form.hasClass('is-uploading')) return false;

        $form.addClass('is-uploading').removeClass('is-error');
        var ajaxData = new FormData($form.get(0));
        if (isAdvancedUpload) {
            ajaxData.set($input.attr('name'), droppedFile);
        } else {

        }
    });

}());
// function defer() {
    //     var res, rej;

    //     var promise = new Promise((resolve, reject) => {
    //         res = resolve;
    //         rej = reject;
    //     });

    //     promise.resolve = res;
    //     promise.reject = rej;

    //     return promise;
    // }

    // this.treeBuilt = defer();

// var tableData = [
//     { id: 456, proj_name: 'mulan', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/30/2020', dept: 'Paint', shots: 350 },
//     { id: 46, proj_name: 'boys', client: 'VHQ', location: 'London', start_date: '11/01/2020', end_date: '11/15/2020', dept: 'Paint', shots: 250 }
// ];
// function renderdata() {
//     var shottable = new Tabulator("#project-table", {
//         data: tableData,
//         height: "350px",

//         layout: "fitDataTable",
//         movableRows: true,
//         columns: [
//             { title: "Id", field: "id", width: 100 },
//             {
//                 title: "Project Name", field: "proj_name", width: 150, editor: "input", editorParams: {

//                     search: true,
//                     elementAttributes: {
//                         maxlength: "50",
//                         //set the maximum character length of the input element to 10 characters
//                     }
//                 }
//             },
//             { title: "Client", field: "client", width: 150 },
//             { title: "Location", field: "location", width: 150 },
//             { title: "Start Date", field: "start_date", width: 150 },
//             { title: "End Date", field: "end_date", width: 150 },
//             { title: "Department", field: "dept", width: 100 },
//             { title: "Total Shots", field: "shots", width: 100 },
//         ]
//     })
// }
// $(document).ready(function () {
//     renderdata();

// })