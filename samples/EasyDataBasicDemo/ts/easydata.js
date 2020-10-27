"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@easydata/core");
var ui_1 = require("@easydata/ui");
var ui_2 = require("@easyquery/ui");
var Validator = /** @class */ (function () {
    function Validator() {
    }
    return Validator;
}());
var RequiredValidator = /** @class */ (function (_super) {
    __extends(RequiredValidator, _super);
    function RequiredValidator() {
        var _this = _super.call(this) || this;
        _this.name = 'Required';
        return _this;
    }
    RequiredValidator.prototype.validate = function (attr, value) {
        if (!attr.isNullable && (!core_1.utils.IsDefinedAndNotNull(value)
            || value === ''))
            return {
                successed: false,
                messages: ['Value is required.']
            };
        return { successed: true };
    };
    return RequiredValidator;
}(Validator));
var TypeValidator = /** @class */ (function (_super) {
    __extends(TypeValidator, _super);
    function TypeValidator() {
        var _this = _super.call(this) || this;
        _this.name = 'Type';
        return _this;
    }
    TypeValidator.prototype.validate = function (attr, value) {
        if (!core_1.utils.IsDefinedAndNotNull(value) || value == '')
            return { successed: true };
        if (core_1.utils.isNumericType(attr.dataType)) {
            if (!core_1.utils.isNumeric(value))
                return {
                    successed: false,
                    messages: ['Value should be a number']
                };
            if (core_1.utils.isIntType(attr.dataType)
                && !Number.isInteger(Number.parseFloat(value))) {
                return {
                    successed: false,
                    messages: ['Value should be an integer number']
                };
            }
        }
        return { successed: true };
    };
    return TypeValidator;
}(Validator));
var EasyForm = /** @class */ (function () {
    function EasyForm(model, entity, html) {
        this.model = model;
        this.entity = entity;
        this.html = html;
        this.validators = [];
        this.errorsDiv = html.querySelector('.errors-block');
    }
    EasyForm.prototype.getHtml = function () {
        return this.html;
    };
    EasyForm.prototype.validate = function () {
        this.clearErrors();
        var inputs = Array.from(this.html.querySelectorAll('input, select'));
        var isValid = true;
        for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
            var input = inputs_1[_i];
            var attr = this.model.getAttributeById(input.name);
            if (input.type === 'checkbox')
                continue;
            var result = this.validateValue(attr, input.value);
            if (!result.successed) {
                if (isValid) {
                    ui_1.domel(this.errorsDiv)
                        .addChild('ul');
                }
                isValid = false;
                for (var _a = 0, _b = result.messages; _a < _b.length; _a++) {
                    var message = _b[_a];
                    this.errorsDiv.firstElementChild.innerHTML += "<li>" + attr.caption + ": " + message + "</li>";
                }
            }
            this.markInputValid(input, result.successed);
        }
        return isValid;
    };
    EasyForm.prototype.getData = function () {
        var inputs = Array.from(this.html.querySelectorAll('input, select'));
        var obj = {};
        for (var _i = 0, inputs_2 = inputs; _i < inputs_2.length; _i++) {
            var input = inputs_2[_i];
            var property = input.name.substring(input.name.lastIndexOf('.') + 1);
            var attr = this.model.getAttributeById(input.name);
            obj[property] = input.type !== 'checkbox'
                ? this.mapValue(attr.dataType, input.value)
                : input.checked;
        }
        return obj;
    };
    EasyForm.prototype.useValidator = function () {
        var validator = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validator[_i] = arguments[_i];
        }
        this.useValidators(validator);
    };
    EasyForm.prototype.useValidators = function (validators) {
        this.validators = this.validators.concat(validators);
    };
    EasyForm.prototype.mapValue = function (type, value) {
        if (core_1.utils.getDateDataTypes().indexOf(type) >= 0)
            return new Date(value);
        if (core_1.utils.isIntType(type))
            return Number.parseInt(value);
        if (core_1.utils.isNumericType(type))
            return Number.parseFloat(value);
        return value;
    };
    EasyForm.prototype.clearErrors = function () {
        this.errorsDiv.innerHTML = '';
        this.html.querySelectorAll('input, select').forEach(function (el) {
            el.classList.remove('is-valid');
            el.classList.remove('is-invalid');
        });
    };
    EasyForm.prototype.markInputValid = function (input, valid) {
        input.classList.add(valid ? 'is-valid' : 'is-invalid');
    };
    EasyForm.prototype.validateValue = function (attr, value) {
        var result = { successed: true, messages: [] };
        for (var _i = 0, _a = this.validators; _i < _a.length; _i++) {
            var validator = _a[_i];
            var res = validator.validate(attr, value);
            if (!res.successed) {
                result.successed = false;
                result.messages = result.messages.concat(res.messages);
            }
        }
        return result;
    };
    EasyForm.build = function (model, entity, params) {
        var isIE = ui_1.browserUtils.IsIE();
        var fb;
        var formHtml = ui_1.domel('div')
            .addClass('kfrm-form')
            .addChild('div', function (b) { return b
            .addClass("errors-block")
            .toDOM(); })
            .addChild('div', function (b) {
            b.addClass("" + (isIE
                ? 'kfrm-fields-ie col-ie-1-4 label-align-right'
                : 'kfrm-fields col-a-1 label-align-right'));
            fb = b;
        })
            .toDOM();
        if (ui_1.browserUtils.IsIE()) {
            fb = ui_1.domel('div', fb.toDOM())
                .addClass('kfrm-field-ie');
        }
        var getInputType = function (dataType) {
            if (dataType == core_1.DataType.Bool) {
                return 'checkbox';
            }
            return 'text';
        };
        var getEditor = function (attr) {
            return attr.defaultEditor || new core_1.MetaValueEditor();
        };
        var addFormField = function (parent, attr) {
            var value = params.values && attr.kind !== core_1.EntityAttrKind.Lookup
                ? params.values.getValue(attr.id)
                : undefined;
            var editor = getEditor(attr);
            if (editor.tag == core_1.MetaEditorTag.Unknown) {
                if (core_1.utils.getDateDataTypes().indexOf(attr.dataType) >= 0) {
                    editor.tag = core_1.MetaEditorTag.DateTime;
                }
                else {
                    editor.tag = core_1.MetaEditorTag.Edit;
                }
            }
            ui_1.domel(parent)
                .addChild('label', function (b) { return b
                .attr('for', attr.id)
                .addText(attr.caption + ": "); });
            if (attr.kind === core_1.EntityAttrKind.Lookup) {
                var lookupEntity_1 = model.getRootEntity()
                    .subEntities.filter(function (ent) { return ent.id == attr.lookupEntity; })[0];
                var dataAttr_1 = model.getAttributeById(attr.dataAttr);
                value = params.values
                    ? params.values.getValue(dataAttr_1.id)
                    : undefined;
                ui_1.domel(parent)
                    .addChild('input', function (b) {
                    b.name(dataAttr_1.id);
                    b.type(getInputType(dataAttr_1.dataType));
                    b.value(core_1.utils.IsDefinedAndNotNull(value)
                        ? value.toString() : '');
                    b.on('focus', function (ev) {
                        var lookupTable = new core_1.EasyDataTable({
                            loader: {
                                loadChunk: function (chunkParams) { return params.loadChunk(chunkParams, lookupEntity_1.id); }
                            }
                        });
                        params.loadChunk({ offset: 0, limit: 1000, needTotal: true }, lookupEntity_1.id)
                            .then(function (data) {
                            for (var _i = 0, _a = data.table.columns.getItems(); _i < _a.length; _i++) {
                                var col = _a[_i];
                                lookupTable.columns.add(col);
                            }
                            lookupTable.setTotal(data.total);
                            for (var _b = 0, _c = data.table.getCachedRows(); _b < _c.length; _b++) {
                                var row = _c[_b];
                                lookupTable.addRow(row);
                            }
                            var ds = new ui_1.DefaultDialogService();
                            var gridSlot = null;
                            var labelEl = null;
                            var slot = ui_1.domel('div')
                                .addClass("kfrm-form")
                                .addChild('div', function (b) {
                                b.addClass("" + (ui_1.browserUtils.IsIE()
                                    ? 'kfrm-fields-ie'
                                    : 'kfrm-fields'));
                                b.addChild('div')
                                    .addClass("kfrm-field")
                                    .addChild('label', function (b) { return labelEl = b
                                    .toDOM(); })
                                    .addChild('div', function (b) { return b
                                    .addClass('kfrm-control')
                                    .addChild('div', function (b) { return gridSlot = b.toDOM(); }); });
                            })
                                .toDOM();
                            var inputEl = ev.target;
                            var selectedValue = inputEl.value;
                            var updateLabel = function () {
                                return labelEl.innerHTML = "Selected value: '" + selectedValue + "'";
                            };
                            updateLabel();
                            var lookupGrid = new ui_1.EasyGrid({
                                slot: gridSlot,
                                dataTable: lookupTable,
                                paging: {
                                    pageSize: 10
                                },
                                onRowDbClick: function (ev) {
                                    var row = ev.row;
                                    selectedValue = row.getValue(attr.lookupDataAttr);
                                    updateLabel();
                                }
                            });
                            ds.open({
                                title: "Select " + lookupEntity_1.caption,
                                body: slot,
                                onSubmit: function () {
                                    ev.target.value = selectedValue;
                                    return true;
                                },
                                onDestroy: function () {
                                    lookupGrid.destroy();
                                }
                            });
                        });
                    });
                });
                return;
            }
            switch (editor.tag) {
                case core_1.MetaEditorTag.DateTime:
                    ui_1.domel(parent)
                        .addChild('input', function (b) {
                        b.name(attr.id);
                        b.value(core_1.utils.IsDefinedAndNotNull(value)
                            ? new Date(value).toUTCString()
                            : '');
                        b.on('focus', function (ev) {
                            var inputEl = ev.target;
                            var oldValue = inputEl.value ? new Date(inputEl.value) : new Date();
                            var pickerOptions = {
                                showCalendar: attr.dataType !== core_1.DataType.Time,
                                showTimePicker: attr.dataType !== core_1.DataType.Date,
                                onApply: function (dateTime) {
                                    inputEl.value = dateTime.toUTCString();
                                },
                                onCancel: function () {
                                    inputEl.value = oldValue.toUTCString();
                                },
                                onDateTimeChanged: function (dateTime) {
                                    inputEl.value = dateTime.toUTCString();
                                }
                            };
                            var dtp = new ui_2.DefaultDateTimePicker(pickerOptions);
                            dtp.setDateTime(oldValue);
                            dtp.show(inputEl);
                        });
                    });
                    break;
                case core_1.MetaEditorTag.List:
                    ui_1.domel(parent)
                        .addChild('select', function (b) {
                        b
                            .attr('name', attr.id);
                        if (editor.values) {
                            for (var i = 0; i < editor.values.length; i++) {
                                b.addOption({
                                    value: value.id,
                                    title: value.text,
                                    selected: i === 0
                                });
                            }
                        }
                    });
                case core_1.MetaEditorTag.Edit:
                default:
                    ui_1.domel(parent)
                        .addChild('input', function (b) {
                        b
                            .name(attr.id)
                            .type(getInputType(attr.dataType));
                        if (value) {
                            if (attr.dataType == core_1.DataType.Bool)
                                b.attr('checked', '');
                            else
                                b.value(core_1.utils.IsDefinedAndNotNull(value)
                                    ? value.toString()
                                    : '');
                        }
                    });
                    break;
            }
        };
        for (var _i = 0, _a = entity.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            if (attr.isPrimaryKey && !params.editPK
                || attr.isForeignKey)
                continue;
            addFormField(fb.toDOM(), attr);
        }
        return new EasyForm(model, entity, formHtml);
    };
    return EasyForm;
}());
var EasyDataView = /** @class */ (function () {
    function EasyDataView() {
        var _this = this;
        this.endpoint = '/api/easydata';
        this.defaultValidators = [];
        this.dlg = new ui_1.DefaultDialogService();
        this.http = new core_1.HttpClient();
        this.defaultValidators.push(new RequiredValidator(), new TypeValidator());
        this.basePath = this.getBasePath();
        this.model = new core_1.MetaData();
        this.resultTable = new core_1.EasyDataTable({
            loader: {
                loadChunk: this.loadChunk.bind(this)
            }
        });
        var modelId = 'EasyData';
        this.http.get(this.endpoint + "/models/" + modelId)
            .then(function (result) {
            if (result.model) {
                _this.model.loadFromData(result.model);
            }
            _this.activeEntity = _this.getActiveEntity();
            _this.renderEntitySelector();
            if (_this.activeEntity) {
                _this.renderGrid();
            }
        });
    }
    EasyDataView.prototype.loadChunk = function (params, entityId) {
        var url = this.endpoint + "/models/" + this.model.getId() + "/crud/" + (entityId || this.activeEntity.id);
        return this.http.get(url, { queryParams: params })
            .then(function (result) {
            var dataTable = new core_1.EasyDataTable({
                chunkSize: 1000
            });
            var resultSet = result.resultSet;
            for (var _i = 0, _a = resultSet.cols; _i < _a.length; _i++) {
                var col = _a[_i];
                dataTable.columns.add(col);
            }
            for (var _b = 0, _c = resultSet.rows; _b < _c.length; _b++) {
                var row = _c[_b];
                dataTable.addRow(row);
            }
            var totalRecords = 0;
            if (result.meta && result.meta.totalRecords) {
                totalRecords = result.meta.totalRecords;
            }
            return {
                table: dataTable,
                total: totalRecords,
                hasNext: !params.needTotal
                    || params.offset + params.limit < totalRecords
            };
        });
    };
    EasyDataView.prototype.getActiveEntity = function () {
        var decodedUrl = decodeURIComponent(window.location.href);
        var splitIndex = decodedUrl.lastIndexOf('/');
        var typeName = decodedUrl.substring(splitIndex + 1);
        return typeName && typeName.toLocaleLowerCase() !== 'easydata'
            ? this.model.getRootEntity().subEntities
                .filter(function (e) { return e.id == typeName; })[0]
            : null;
    };
    EasyDataView.prototype.getBasePath = function () {
        var decodedUrl = decodeURIComponent(window.location.href);
        var easyDataIndex = decodedUrl.indexOf('easydata');
        return decodedUrl.substring(0, easyDataIndex + 'easydata'.length);
    };
    EasyDataView.prototype.renderEntitySelector = function () {
        var _this = this;
        var entities = this.model.getRootEntity().subEntities;
        var entityListSlot = document.getElementById('EntityList');
        if (entityListSlot) {
            var ul = document.createElement('ul');
            ul.className = 'list-group';
            entityListSlot.appendChild(ul);
            var _loop_1 = function (entity) {
                var li = document.createElement('li');
                li.className = 'list-group-item';
                if (entity === this_1.activeEntity) {
                    li.classList.add('active');
                }
                li.addEventListener('click', function () {
                    window.location.href = _this.basePath + "/" + entity.id;
                });
                li.innerHTML = entity.caption;
                ul.appendChild(li);
            };
            var this_1 = this;
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                _loop_1(entity);
            }
        }
    };
    EasyDataView.prototype.renderGrid = function () {
        var _this = this;
        this.loadChunk({ offset: 0, limit: 1000, needTotal: true })
            .then(function (data) {
            for (var _i = 0, _a = data.table.columns.getItems(); _i < _a.length; _i++) {
                var col = _a[_i];
                _this.resultTable.columns.add(col);
            }
            _this.resultTable.setTotal(data.total);
            for (var _b = 0, _c = data.table.getCachedRows(); _b < _c.length; _b++) {
                var row = _c[_b];
                _this.resultTable.addRow(row);
            }
            var gridSlot = document.getElementById('Grid');
            _this.grid = new ui_1.EasyGrid({
                slot: gridSlot,
                dataTable: _this.resultTable,
                paging: {
                    pageSize: 15,
                },
                addColumns: true,
                onAddColumnClick: _this.addClickHandler.bind(_this),
                onGetCellRenderer: _this.manageCellRenderer.bind(_this)
            });
        });
    };
    EasyDataView.prototype.manageCellRenderer = function (column, defaultRenderer) {
        var _this = this;
        if (column.isRowNum) {
            column.width = 100;
            return function (value, column, cell) {
                ui_1.domel('div', cell)
                    .addClass("keg-cell-value")
                    .addChild('a', function (b) { return b
                    .attr('href', 'javascript:void(0)')
                    .text('Edit')
                    .on('click', function (ev) { return _this.editClickHandler(ev, cell); }); })
                    .addChild('span', function (b) { return b.text(' | '); })
                    .addChild('a', function (b) { return b
                    .attr('href', 'javascript:void(0)')
                    .text('Delete')
                    .on('click', function (ev) { return _this.deleteClickHandler(ev, cell); }); });
            };
        }
    };
    EasyDataView.prototype.addClickHandler = function () {
        var _this = this;
        var form = EasyForm.build(this.model, this.activeEntity, { loadChunk: this.loadChunk.bind(this), editPK: true });
        form.useValidators(this.defaultValidators);
        this.dlg.open({
            title: "Create " + this.activeEntity.caption,
            body: form.getHtml(),
            onSubmit: function () {
                if (!form.validate())
                    return false;
                var obj = form.getData();
                var url = _this.endpoint + "/models/" + _this.model.getId() +
                    ("/crud/" + _this.activeEntity.id);
                _this.http.post(url, obj, { dataType: 'json' })
                    .then(function () {
                    window.location.reload();
                })
                    .catch(function (error) {
                    _this.dlg.open({
                        title: 'Ooops, smth went wrong',
                        body: error.message,
                        closable: true,
                        cancelable: false
                    });
                });
            }
        });
    };
    EasyDataView.prototype.editClickHandler = function (ev, cell) {
        var _this = this;
        var rowEl = cell.parentElement;
        var index = Number.parseInt(rowEl.getAttribute('data-row-idx'));
        this.resultTable.getRow(index)
            .then(function (row) {
            if (row) {
                var form_1 = EasyForm.build(_this.model, _this.activeEntity, { loadChunk: _this.loadChunk.bind(_this), values: row });
                form_1.useValidators(_this.defaultValidators);
                _this.dlg.open({
                    title: "Edit " + _this.activeEntity.caption,
                    body: form_1.getHtml(),
                    onSubmit: function () {
                        var keyAttrs = _this.activeEntity.attributes.filter(function (attr) { return attr.isPrimaryKey; });
                        var keys = keyAttrs.map(function (attr) { return row.getValue(attr.id); });
                        if (!form_1.validate())
                            return false;
                        var obj = form_1.getData();
                        var url = "/api/easydata/models/" + _this.model.getId() +
                            ("/crud/" + _this.activeEntity.id + "/" + keys.join(':'));
                        _this.http.put(url, obj, { dataType: 'json' })
                            .then(function () {
                            window.location.reload();
                        })
                            .catch(function (error) {
                            _this.dlg.open({
                                title: 'Ooops, smth went wrong',
                                body: error.message,
                                closable: true,
                                cancelable: false
                            });
                        });
                    }
                });
            }
        });
    };
    EasyDataView.prototype.deleteClickHandler = function (ev, cell) {
        var _this = this;
        var rowEl = cell.parentElement;
        var index = Number.parseInt(rowEl.getAttribute('data-row-idx'));
        this.resultTable.getRow(index)
            .then(function (row) {
            if (row) {
                var keyAttrs = _this.activeEntity.attributes.filter(function (attr) { return attr.isPrimaryKey; });
                var keys_1 = keyAttrs.map(function (attr) { return row.getValue(attr.id); });
                var entityId = keyAttrs.map(function (attr, index) { return attr.id + ":" + keys_1[index]; }).join(';');
                _this.dlg.openConfirm("Delete " + _this.activeEntity.caption, "Are you shure about removing this entity: [" + entityId + "]?")
                    .then(function (result) {
                    if (result) {
                        var url = _this.endpoint + "/models/" + _this.model.getId() +
                            ("/crud/" + _this.activeEntity.id + "/" + keys_1.join(':')); //pass entityId in future
                        _this.http.delete(url).then(function () {
                            window.location.reload();
                        })
                            .catch(function (error) {
                            _this.dlg.open({
                                title: 'Ooops, smth went wrong',
                                body: error.message,
                                closable: true,
                                cancelable: false
                            });
                        });
                    }
                });
            }
        });
    };
    return EasyDataView;
}());
window.addEventListener('load', function () {
    window['easydata'] = new EasyDataView();
});
