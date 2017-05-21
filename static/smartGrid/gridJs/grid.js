
var application = angular.module('application', []);

function getDesiTitle(desiIcon) {
    switch (desiIcon) {
        case 'ccw': {
            return 'ccw';
        }
        default: {
            return 'search-5';
        }
    }
};
function getDesiTitleTxt(desiIcon) {
    switch (desiIcon) {
        case 'ccw': {
            return 'بازگشت به چرخه';
        }
        default: {
            return '';
        }
    }
};
getSortList = function (propertyName, ascending) {

    //var sortListItem = new Array();
    //sortListItem[0] = new Object();
    //sortListItem[0].orderName = propertyName;
    //sortListItem[0].sortType = ascending;
    var sortListItem = new Object();
    sortListItem.orderName = propertyName;
    sortListItem.sortType = ascending;
    return sortListItem;
};
var gridColOptions = {
    'fieldName': null,
    'colSize': gridDefaultOptions.defaultColSize,
    'colPriority': gridDefaultOptions.defaultcolPriority
};
application.directive('focusOn', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$on(attrs.focusOn, function (e) {
            $timeout(function () {
                element[0].focus();
            });
        });
    };
});
application.directive('integerOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
application.directive('smartGridcomplist', function () {
    return {
        restrict: 'E',
        //		scope: {},
        templateUrl: '../smartGrid/gridDirectives/gridCompListDir.html',

        //controller: function (scope) {

        //    console.log(scope);

        //}
    };
});

application.directive('smartGridcompfooter', function () {
    return {
        restrict: 'E',
        //    scope: {},
        templateUrl: '../smartGrid/gridDirectives/gridCompFooter.html',

        //controller: function (scope) {

        //    console.log(scope);

        //}
    };
});

//-----------------------------------sort field------------------------------------------//
application.factory('SortFields', function () {
    var service = {};
    service.orderName = 'id',
        service.sortType = '',
        service.iconOrder = '',
        service.cleanSortField = function () {

            var paginationObj = new Object();

            paginationObj.sortList = getSortList(null, null);
            setSortOption(paginationObj);

            service.orderName = '',
                service.sortType = '',
                service.iconOrder = '';
        };
    return service;
});
//-----------------------------------factory for http request---------------------------//
application.factory('gridHttpRequest', ['$http', function ($http) {
    var service = {};

    service.post = function (url, data, success, error) {
        $http({
            url: url,
            method: "POST",
            data: convertObjectToJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).success(function (data, status, headers, config) {
            if (data.result == undefined && (data.Url == "/Error/Error")) {
                notifyAlert(_errorMsg);
                return;
            }
            else if (data.result == undefined && (data.Url == "/")) {

                notifyInfo(_infoMsg);
                success(data);
            }
            else if (data.result.status == 1) {
                //if (data.result.message)
                //    notifyInfo(data.result.message);
                //else
                //    notifyInfo(_infoMsg);
                success(data);
            }
            else if (data.result.status == 0) {

                if (data.result.message == "sessionKill")
                    location.href = "/login/login";
                else if (data.result.message == "sessionShouldBeKill")
                    location.href = "/login/login";
                else if (data.result.message == "AccessDenied")
                    location.href = "/login/pageError";
                else if (data.result.message)
                    notifyAlert(data.result.message);
                else
                    notifyAlert(_errorMsg);
                if (data.result.callback == "captcha")
                    success(data);
                else
                    return;
            }
            else if (data.result.status == 2) {
                if (data.result.message)
                    notifyWarning(data.result.message);
                else
                    notifyWarning(_noFileWarn);
                return;
            }

        }).error(function (err, status, headers, config) {
            if (status == 404) {
                notifyAlert(_errorMsg);
                return;
            }
            if (data.result)
                if (data.result.message == "sessionKill")
                    location.href = "/login/login";
                else if (data.result.message == "AccessDenied")
                    location.href = "/login/pageError";

            notifyAlert(_errorMsg);
            if (error)
                error(err);

            //Loader.setLoader(false);
        });
    }
    return service;
}]);
application.factory('gridFactory', ['gridHttpRequest', function (gridHttpRequest) {
    var srv = {};

    srv.myFunc = function (scope, sce, gridColOptionsArray, gridServOption, callback) {

        //setting

        scope.openCloseSettingFlag = false;
        scope.filterFlag = gridServOption.filterFlag;
        scope.settingFlag = gridServOption.settingFlag;
        scope.selectAllFlag = gridServOption.selectAllFlag;
        scope.checkBoxForRowFlag = gridServOption.checkBoxForRowFlag;
        scope.detailBtnFlag = gridServOption.detailBtnFlag;
        scope.detailBtnActionFlag = gridServOption.detailBtnActionFlag;
        scope.detailBtnActionEditFlag = gridServOption.detailBtnActionEditFlag;
        scope.deleteBtnActionFlag = gridServOption.deleteBtnActionFlag;

        scope.checkLblForRowFlag = gridServOption.checkLblForRowFlag;
        scope.defaultDetailBtnSize = gridDefaultOptions.defaultDetailBtnSize;
        scope.defaultBigDetailBtnSize = gridDefaultOptions.defaultBigDetailBtnSize;
        scope.defaultActionColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultActionColSizeBigGrid : gridDefaultOptions.defaultActionColSize;
        scope.defaultSelectAllBtnSize = gridDefaultOptions.defaultSelectAllBtnSize;
        scope.SortFields = gridServOption.SortFields;
        scope.searchData = gridServOption.searchData;
        scope.pageSize = gridServOption.pageSize;
        scope.pageNumber = gridServOption.pageNumber;
        scope.searchSrv = gridServOption.searchSrv;
        scope.icClicentGridData = gridServOption.icClicentGridData;
        scope.gridName = gridServOption.gridName;
        scope.showDataItemListName = gridServOption.showDataItemListName;
        scope.filterExample = gridServOption.filterExample;
        scope.gridType = gridServOption.gridType;
        scope.selectClass;

        scope.defaultTinyColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultTinyColSizeBigGrid : gridDefaultOptions.defaultTinyColSize;
        scope.defaultColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultColSizeBigGrid : gridDefaultOptions.defaultColSize;
        scope.desiredButsItems = [];

        scope.bigGrid = gridServOption.bigGrid;

        scope.tinyColumnsSize = 0;
        scope.tinyActionColumnsSize = 0;
        if (scope.detailBtnActionFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        }
        if (scope.detailBtnActionEditFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        }
        //if (scope.detailBtnFlag) {
        //    if (scope.gridType && scope.gridType === gridDefaultOptions.defaultBIG) {
        //        scope.tinyColumnsSize += parseInt(scope.defaultBigDetailBtnSize);
        //        scope.tinyActionColumnsSize += parseInt(scope.defaultBigDetailBtnSize);
        //    } else {
        //        scope.tinyColumnsSize += parseInt(scope.defaultDetailBtnSize);
        //        scope.tinyActionColumnsSize += parseInt(scope.defaultDetailBtnSize);
        //    }
        //}
        if (scope.selectAllFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultSelectAllBtnSize);
        }
        if (scope.deleteBtnActionFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultDetailBtnSize);
        }
        angular.forEach(gridServOption.desiredButtonsItems, function (val, key) {
            var desiObj = {};
            desiObj.icon = val;
            desiObj.title = getDesiTitle(desiObj.icon);
            desiObj.titleTxt = getDesiTitleTxt(desiObj.icon);
            scope.desiredButsItems.push(desiObj);
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        });
        scope.tinyColumnsFlag = false;
        if (scope.tinyActionColumnsSize !== 0)
            scope.tinyColumnsFlag = true;
        scope.greenSelected = gridServOption.greenSelected;
        //scope.multiGridInPage = gridServOption.multiGridInPage;
        //scope.currentGridDataPlace = gridServOption.currentGridDataPlace;

        scope.searchObj = new Object();
        var Data = [];

        scope.pagination = {
            last: gridServOption.pageSize + 1,
            currentPage: gridServOption.pageNumber + 1
        };


        scope.openCloseSettingClick = function () {
            if (scope.openCloseSettingFlag)
                scope.openCloseSettingFlag = false;
            else
                scope.openCloseSettingFlag = true;
        };
        scope.getPaging = function (dataLength, pageSize, pageNumber) {
            //how much items per page to show  
            var show_per_page = pageSize;
            //getting the amount of elements inside content div  
            var number_of_items = dataLength;
            //calculate the number of pages we are going to have  
            var number_of_pages = Math.ceil(number_of_items / show_per_page);
            scope.number_of_pages = number_of_pages;
            scope.pagination.last = number_of_pages;
            scope.pages = [];
            if (pageNumber < 5)
                pageNumber = 0;
            var current_link = pageNumber;
            //if (current_link != 1)
            //    current_link -= 1;
            // var pageCount = new Object();
            if (number_of_pages <= 5) {
                while (number_of_pages > current_link) {

                    current_link++;
                    scope.pages.push(current_link);
                }
            } else {
                if (5 > current_link) {
                    while (5 > current_link) {
                        if (current_link < number_of_pages) {
                            current_link++;
                            scope.pages.push(current_link);
                        }
                    }
                    scope.pages.push('...');
                }
                else {
                    if (number_of_pages > pageNumber) {
                        {
                            while (5 + pageNumber > current_link) {
                                if (current_link <= number_of_pages) {
                                    scope.pages.push(current_link);
                                    current_link++;
                                } else {
                                    return;
                                }
                            }
                            if (current_link != number_of_pages)
                                scope.pages.push('...');
                        }
                    }
                }
            }
            //var myEl = angular.element(document.querySelector('.myActive' + pageNumber));
            //myEl.addClass(scope.selectClass);

        };

        scope.createGridData = function (pageNumber) {

            scope.keysArrayPlus = new Array();

            if (($.grep(gridColOptionsArray, function (e) { return e.fieldName == '_id'; })).length == 0)
                gridColOptionsArray.push({ 'fieldName': '_id', 'colPriority': 0, 'colSize': scope.defaultTinyColSize });

            for (var iKArr = 0; iKArr < gridColOptionsArray.length; iKArr++)
                scope.keysArrayPlus.push(gridColOptionsArray[iKArr].fieldName);


            scope.gridKey = srv.getObjectTitleAndOptions(scope.keysArrayPlus, gridColOptionsArray, '', scope);

            scope.gridData = [];
            var startNo = (scope.pageSize * (pageNumber));
            var endNo = scope.pageSize;
            if (pageNumber != 0) {
                startNo = (scope.pageSize * (pageNumber - 1)) + 1;
                endNo = (scope.pageSize * pageNumber);
            }
            //if (Data.length < endNo)
            //    endNo = Data.length;
            for (var k = 0; k < endNo; k++) {
                var myObj = new Array();
                var colObj = new Object();
                if (Data[k] != undefined) {
                    if (pageNumber == 0)
                        Data[k]._id = k + 1;
                    else
                        Data[k]._id = k + (pageNumber * scope.pageSize) + 1;

                    var fields = Data[k];
                    for (var i = 0; i < scope.gridKey.length; i++) {
                        var ob = new Object();

                        if (fields[scope.gridKey[i].name] != undefined)
                            ob.fieldName = fields[scope.gridKey[i].name];
                        else
                            ob.fieldName = '-';

                        ob.celFieldName = ob.fieldName;
                        if (ob.fieldName.length > 100) {
                            ob.celFieldName = ob.fieldName.slice(0, 100);
                        }

                        if (scope.gridKey[i].fieldIsDropDown != undefined)
                            ob.fieldIsDropDown = scope.gridKey[i].fieldIsDropDown;
                        else
                            ob.fieldIsDropDown = false;
                        if (ob.fieldIsDropDown) {

                            if (scope.gridKey[i].dropDownType === 'Number') {
                                ob.fieldIsDropDownArr = {};
                                ob.fieldIsDropDownArr.values = [];
                                if (ob.fieldName !== '-') {
                                    for (var iDrp = 1; iDrp <= ob.fieldName; iDrp++) {
                                        var obj = {};
                                        obj = iDrp;
                                        ob.fieldIsDropDownArr.values.push(obj);
                                    }
                                    if (ob.fieldIsDropDownArr)
                                        ob.fieldIsDropDownArr.value = ob.fieldName;
                                }
                            }
                        }

                        ob.filedSize = scope.gridKey[i].colSize;
                        ob.fieldType = scope.gridKey[i].name;
                        ob.searchInpType = scope.gridKey[i].searchInpType;
                        
                        // if (scope.filterExample) {
                        if (scope.gridKey[i].isDropDownSearch)
                            scope.gridKey[i].isDropDownSearch.value = scope.searchData[scope.gridKey[i].fildSearch];
                        //    else
                        //        scope.gridKey[i].searchVal = scope.gridKey[i].searchVal = (scope.searchData[scope.filterExample])[scope.gridKey[i].fildSearch];
                        //}
                        else
                            scope.gridKey[i].searchVal = scope.searchData[scope.gridKey[i].fildSearch];

                        var sortIcon = gridDefaultOptions.defaultSortIcon;
                        var sortType = 'none';
                        scope.gridKey[i].sortIcon = sortIcon;
                        scope.gridKey[i].sortType = sortType;
                        scope.gridKey[i].selectCls = '';

                        if (scope.gridKey[i].sortField == scope.SortFields.orderName) {
                            scope.gridKey[i].sortType = scope.SortFields.sortType;
                            switch (scope.gridKey[i].sortType) {
                                case 'none':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.defaultSortIcon;
                                    break;
                                case 'desc':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.downSortIcon;
                                    break;
                                case 'asc':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.upSortIcon;
                                    break;
                                default:
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.defaultSortIcon;
                                    break;
                            }
                            scope.gridKey[i].selectCls = 'select';
                        }
                        fields['greenSelected'] = Data[k][scope.greenSelected];
                        ob.obj = fields;
                        myObj.push(ob);
                    }

                    scope.gridData.push(myObj);

                }

            };

            //if (scope.multiGridInPage)
            //    scope.currentGridDataPlace = scope.gridData;
        }


        //
        scope.setCurrent = function (pageNumber, type, callback) {

            //if (scope.pagination.last == pageNumber + 1 || scope.pagination.last == pageNumber)
            //    $("li.arrowLeft").hide();
            if (scope.pagination.last === pageNumber && type === 'pagination')
                return;
            if (pageNumber > -1) {

                if (type != 'pagination') {
                    if (pageNumber != 0)
                        pageNumber -= 1;
                    //
                    //countSelect = (countSelect % scope.pageSize) + scope.pageSize;
                }


                var obj = new Object();
                obj = scope.searchData;
                obj.pageNumber = pageNumber;
                obj.pageSize = scope.pageSize;

                if (scope.searchSrv === 'SERVICE_CLIENT_IC_GRID') {
                    viewData = scope.icClicentGridData;

                    Data = viewData;

                    if (callback)
                        callback(viewData);
                    if (scope.getDataCallback)
                        scope.getDataCallback(viewData);//this methode for get data to my controller

                    scope.totalCount = parseInt(viewData.length);

                    if (scope.totalCount != 0) {
                        // scope.getPaging(scope.totalCount, scope.pageSize, scope.pageNumber);
                        if (scope.pagination.last < pageNumber)
                            return;
                        if (pageNumber == '...')
                            return;

                        if (type == 'pagination')
                            if (document.getElementsByClassName('myActive' + pageNumber).length == 0)
                                scope.getPaging(scope.totalCount, scope.pageSize, pageNumber);

                        scope.createGridData(pageNumber);


                        setTimeout(function () {
                            //if (pageNumber == 0)
                            pageNumber += 1;
                            scope.pagination.currentPage = pageNumber;
                            scope.pagination.last = scope.number_of_pages;

                            angular.forEach(document.querySelectorAll('.page'), function (item) {
                                angular.element(item).removeClass('select')
                            });

                            $("ul.paging li." + scope.gridName).each(function () {
                                $(this).removeClass('select')

                            });
                            $(".current" + pageNumber + scope.gridName).addClass('select');
                        }, 200);

                    }
                    else {
                        scope.gridData = [];
                    }
                } else {
                    gridHttpRequest.post(scope.searchSrv, obj, function (viewData) {

                        if (scope.showDataItemListName)
                            Data = viewData.resultSet[scope.showDataItemListName];
                        else
                            Data = viewData.resultSet;

                        if (viewData.result)
                            if (viewData.result.callback)
                                scope.totalCount = parseInt(viewData.result.callback);
                            else
                                scope.totalCount = gridDefaultOptions.defaultTotalCount;
                        else
                            scope.totalCount = Data.length;
                        if (scope.totalCount != 0) {
                            // scope.getPaging(scope.totalCount, scope.pageSize, scope.pageNumber);
                            if (scope.pagination.last < pageNumber)
                                return;
                            if (pageNumber == '...')
                                return;

                            if (type == 'pagination')
                                if (document.getElementsByClassName('myActive' + pageNumber).length == 0)
                                    scope.getPaging(scope.totalCount, scope.pageSize, pageNumber);

                            scope.createGridData(pageNumber);


                            setTimeout(function () {
                                //if (pageNumber == 0)
                                pageNumber += 1;
                                scope.pagination.currentPage = pageNumber;
                                scope.pagination.last = scope.number_of_pages;

                                angular.forEach(document.querySelectorAll('.page'), function (item) {
                                    angular.element(item).removeClass('select')
                                });

                                $("ul.paging li." + scope.gridName).each(function () {
                                    $(this).removeClass('select')

                                });
                                $(".current" + pageNumber + scope.gridName).addClass('select');
                            }, 200);

                        }
                        else {
                            scope.gridData = [];
                        }
                    });
                    if (callback)
                        callback(viewData.resultSet);
                    if (scope.getDataCallback)
                        scope.getDataCallback(viewData);//this methode for get data to my controller

                }
            }

        }

        scope.setCurrent(scope.pageNumber, 'pagination', callback);
        scope.changePageSize = function (changePageSize) {

            scope.pageSize = parseInt(changePageSize);
            scope.setCurrent(scope.pageNumber, 'pagination');
        }
        //----------------------------- select All Checkbox ------------------------------
        scope.checkAll = function ($event) {

            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            switch (action) {
                case 'add': {
                    scope.selectedAll = true;
                    break;
                }
                case 'remove': {
                    scope.selectedAll = false;
                    break;
                }
                default:
                    break;
            }
            angular.forEach(scope.gridData, function (item) {

                item.Selected = scope.selectedAll;

                if (item.Selected)
                    scope.selectGridRow(item[0].obj, true);
                else
                    scope.selectGridRow(item[0].obj, false);
            });

        };
        scope._doEdit = function (rowData) {

            scope.editActionBtn(rowData[0].obj);
        };
        scope._doDetail = function (rowData) {

            scope.doDetail(rowData[0].obj);
        };
        scope._doSort = function (col) {

            //alert(col.id);
            var sortField = col.sortField;
            if (col.sortIcon == gridDefaultOptions.defaultSortIcon) {
                col.sortIcon = gridDefaultOptions.downSortIcon;
                scope.SortFields.sortType = 'asc';
            }
            else if (col.sortIcon == gridDefaultOptions.downSortIcon) {
                col.sortIcon = gridDefaultOptions.upSortIcon;
                scope.SortFields.sortType = 'none';
            }
            else if (col.sortIcon == gridDefaultOptions.upSortIcon) {
                col.sortIcon = gridDefaultOptions.defaultSortIcon;
                scope.SortFields.sortType = 'desc';
            }

            scope.SortFields.orderName = sortField;

            //  scope.searchData.pagination = getPaginationObject(paginationObject.pageNumber, paginationObject.pageSize);

            if (!(scope.SortFields.sortType == "none"))
                scope.searchData.orderInfo = getSortList(sortField, scope.SortFields.sortType);
            else
                scope.searchData.orderInfo = null;

            // function on the asnad2_Utils.js
            //  setSortOption(scope.searchData.pagination);
            scope.setCurrent(scope.pageNumber, 'pagination');
        };
        scope._isSelected = function (rowData) {
            if (scope.isSelected) {

                var flg = scope.isSelected(rowData[0].obj);
                if (tmpSelect.indexOf(rowData[0].obj.id) === -1 && flg) {
                    tmpSelect.push(rowData[0].obj.id);
                    countSelect = tmpSelect.length;
                }
                else if (tmpSelect.indexOf(rowData[0].obj.id) !== -1 && flg) {
                    //   countSelect += 1;
                }
                else if (tmpSelect.indexOf(rowData[0].obj.id) !== -1 && !flg) {

                    tmpSelect.splice(tmpSelect.indexOf(rowData[0].obj.id), 1);
                    //countSelect -= 1;
                }

                return flg;
            }
        };
        scope._updateSelection = function ($event, rowData) {

            scope.$broadcast('isOpen');//focus
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');

            switch (action) {
                case 'add': {
                    rowData.Selected = true;
                    countSelect++;
                    scope.selectGridRow(rowData[0].obj, true);
                    break;
                }
                case 'remove': {

                    rowData.Selected = false;
                    if (countSelect > 0)
                        countSelect--;
                    scope.selectGridRow(rowData[0].obj, false);
                    break;
                }
                default:
                    break;
            }
            //for (iC = 0 ; iC < scope.gridData.length ; iC++) {
            //    if (scope.gridData[iC].Selected)
            //        countSelect++;
            //}

            if (countSelect !== 0 && countSelect % scope.pageSize === 0)
                scope.selectedAll = true;
            else
                scope.selectedAll = false;
        };
        scope.desiAction = function (desiIcon, desiItem) {
            scope.doDesies(desiIcon, desiItem[0].obj);
        };
        scope.editAction = function (editElem) {
            scope.editActionBtn(editElem[0].obj);
        }
        scope.deletAction = function (deleteElm) {
            scope.deletActionBtn(deleteElm[0].obj);
        }
        scope.viewDetail = function (detailElm) {
            scope.viewDetailBtn(detailElm[0].obj);
        }
        scope.selectRoww = function (selectElm, that) {

            $("ul[data-gridName='" + scope.gridName + "'] li.roww").each(function () {
                $(this).removeClass('select');
            });
            $("ul[data-gridName='" + scope.gridName + "'] li[data-id='" + selectElm[0].obj.id + "']").addClass('select');
            if (scope._selectRoww)
                scope._selectRoww(selectElm[0].obj, scope.gridName);
        }

        scope.enterSearch = function (colType, colSearch) {
            var searchFields = [];
            $("div.searchAria input.gridInputDefaultSearch").each(function () {
                if (searchFields.indexOf($(this).attr('data-search')) === -1) {

                    searchFields.push($(this).attr('data-search'));
                    if ($(this).attr('data-search') != undefined) {
                        if (scope.filterExample)
                            (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = $(this)[0].value;
                        else
                            scope.searchData[$(this).attr('data-search')] = $(this)[0].value;
                    }
                    else {
                        if (scope.filterExample)
                            (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value;
                        else
                            scope.searchData[$(this).attr('id')] = $(this)[0].value;
                    }
                }
            });
            if (colType == 'status') {
                $("div.searchAria select.gridInputDefaultSearch").each(function () {

                    if ($(this).attr('data-search') != undefined) {
                        //$scope.prop.value = 'Service 1'
                        //if ($(this)[0].label != '? string:f_status ?')

                        if (scope.filterExample)
                            (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = colSearch.isDropDownSearch.value;
                        else
                            scope.searchData[$(this).attr('data-search')] = colSearch.isDropDownSearch.value;
                    }
                    //else {
                    //    if (scope.filterExample)
                    //        (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value;
                    //    else
                    //        scope.searchData[$(this).attr('id')] = $(this)[0].value;
                    //}

                });

            }
            scope.setCurrent(scope.pageNumber, 'pagination');
        }
        scope.clearSearchAria = function () {
            $("div.searchAria input.gridInputDefaultSearch").each(function () {
                $(this)[0].value = '';
                if ($(this).attr('data-search') != undefined) {
                    if (scope.filterExample)
                        (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = $(this)[0].value;
                    else
                        scope.searchData[$(this).attr('data-search')] = $(this)[0].value;
                }
                else {
                    if (scope.filterExample)
                        (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value;
                    else
                        scope.searchData[$(this).attr('id')] = $(this)[0].value;
                }

            });
            scope.setCurrent(scope.pageNumber, 'pagination');
        }

        //scope.toTrustedHTML = function (html) {
        //    return sce.trustAsHtml(html.toString());
        //}
        scope.selectDrpOpt = function (selectedDropDownField, selectedOptData) {

            if (scope.selectDropDownOption)
                scope.selectDropDownOption(selectedDropDownField, selectedOptData[0].obj);
        }
    },

        srv.columnSizeCheker = function (finalArray, gridName, scope) {
            scope.allColumnsCount = finalArray.length;
            scope.allColumnsSize;

            scope.smalColumns = {
                'columnsCount': 0,
                'columnsSize': 0
            };

            scope.largColumns = {
                'columnsCount': 0,
                'columnsSize': 0
            };
            if (scope.tinyColumnsFlag && scope.desiredButsItems.length > 0) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultSelectAllBtnSize);
            }

            if (scope.selectAllFlag && scope.checkBoxForRowFlag) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultSelectAllBtnSize);
            }
            //if (scope.detailBtnFlag) {
            //    scope.allColumnsCount++;
            //    scope.smalColumns.columnsCount++;
            //    scope.smalColumns.columnsSize += parseInt(scope.defaultDetailBtnSize);
            //}
            if (scope.detailBtnActionFlag) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
            }
            if (scope.detailBtnActionEditFlag) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
            }
            if (scope.deleteBtnActionFlag) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
            }
            angular.forEach(finalArray, function (item) {

                if (item.name != 'id') {
                    if (item.colSize <= 5) {
                        scope.smalColumns.columnsCount++;
                        scope.smalColumns.columnsSize += parseInt(item.colSize);
                    }
                    else {
                        scope.largColumns.columnsCount++;
                        scope.largColumns.columnsSize += parseInt(item.colSize);
                    }

                }
            });

            scope.allColumnsSize = scope.largColumns.columnsSize + scope.smalColumns.columnsSize;
            if (scope.allColumnsSiz % 5 != 0 && scope.gridName === 'gridDeviceList')
                scope.allColumnsSize = scope.allColumnsSize + (scope.allColumnsSiz % 5);

            scope.differencePlus = 0;
            scope.differenceMines = 0;

            if (parseInt(scope.allColumnsSize) > 100) {
                scope.differenceMines = parseInt(scope.allColumnsSize) - 100;
                while (scope.differenceMines > 0) {
                    for (var i = finalArray.length - 1; i > 0; i--) {
                        var item = finalArray[i];
                        if (parseInt(scope.allColumnsSize) != 100) {
                            if (item.name != 'id' && item.name != '_id') {
                                if (parseInt(item.colSize) > 5) {
                                    item.colSize = parseInt(item.colSize) - 5;
                                    scope.allColumnsSize = scope.allColumnsSize - 5;
                                    scope.differenceMines = scope.differenceMines - 5;
                                }
                            }
                        }
                    }
                }
            }
            else if (parseInt(scope.allColumnsSize) % 100 != 0) {
                scope.differencePlus = 100 - parseInt(scope.allColumnsSize);
                while (scope.differencePlus > 0) {
                    angular.forEach(finalArray, function (item) {
                        if (parseInt(scope.allColumnsSize) != 100) {
                            if (item.name != 'id' && item.name != '_id') {

                                item.colSize = parseInt(item.colSize) + 5;
                                scope.allColumnsSize = scope.allColumnsSize + 5;
                                scope.differencePlus = scope.differencePlus - 5;
                            }
                        }
                    });
                }
            }

            return finalArray;
        };


    srv.getObjectTitleAndOptions = function (gridKey, gridColOptions, gridName, scope) {

        var finalArray = new Array();
        for (var i = 0; i < gridKey.length; i++) {

            var obj = new Object();
            obj.id = i;
            obj.name = createFieldValue(gridKey[i]);
            obj.sortField = createSortField(gridKey[i], gridName);

            obj.displayName = convertDisplayNameToFarsi(gridKey[i], gridName);
            //  obj.colSize = gridDefaultOptions.defaultColSize;
            obj.colPriority = gridDefaultOptions.defaultcolPriority;

            if (gridColOptions)
                for (var iGridColOption = 0; iGridColOption < gridColOptions.length; iGridColOption++) {
                    if (gridKey[i] == gridColOptions[iGridColOption].fieldName) {

                        if (gridColOptions[iGridColOption].fildSearch != undefined)
                            obj.fildSearch = gridColOptions[iGridColOption].fildSearch;
                        else
                            obj.fildSearch = gridColOptions[iGridColOption].fieldName;

                        if (gridColOptions[iGridColOption].iconList != undefined)
                            obj.iconList = gridColOptions[iGridColOption].iconList;
                        else
                            obj.iconList = null;


                        if (gridColOptions[iGridColOption].colSize != undefined)
                            obj.colSize = gridColOptions[iGridColOption].colSize;
                        else {
                            obj.colSize = scope.defaultColSize;
                            if (scope.gridType)
                                if (scope.gridType === gridDefaultOptions.defaultBIG)
                                    obj.colSize = gridDefaultOptions.defaultBigColSize;
                                else
                                    obj.colSize = scope.defaultColSize;
                        }

                        if (gridColOptions[iGridColOption].colPriority != undefined)
                            obj.colPriority = gridColOptions[iGridColOption].colPriority;
                        else
                            obj.colPriority = gridDefaultOptions.defaultcolPriority;

                        if (gridColOptions[iGridColOption].hasSort == true)
                            obj.hasSort = gridColOptions[iGridColOption].hasSort;
                        else
                            obj.hasSort = false;
                        if (gridColOptions[iGridColOption].isDropDownSearch != undefined) {

                            obj.isDropDownSearch = {
                                "type": "select",
                                "values": gridColOptions[iGridColOption].isDropDownSearch
                            };
                        }
                        else
                            obj.isDropDownSearch = null;

                        if (gridColOptions[iGridColOption].fieldIsDropDown == true)
                            obj.fieldIsDropDown = gridColOptions[iGridColOption].fieldIsDropDown;
                        else
                            obj.fieldIsDropDown = false;


                        if (gridColOptions[iGridColOption].dropDownType != undefined)
                            obj.dropDownType = gridColOptions[iGridColOption].dropDownType;
                        else
                            obj.dropDownType = false;
                        //dropDownType

                        if (gridColOptions[iGridColOption].searchInpType != undefined)
                            obj.searchInpType = gridColOptions[iGridColOption].searchInpType;
                        else
                            obj.searchInpType = '';
                    }
                }
            finalArray.push(obj);
        }

        finalArray.sort(srv.compare);

        return srv.columnSizeCheker(finalArray, gridName, scope);

    },
        srv.compare = function (a, b) {
            if (a.colPriority < b.colPriority)
                return -1;
            if (a.colPriority > b.colPriority)
                return 1;
            return 0;
        };


    return srv;

}]);
application.factory('paging', ['gridHttpRequest', function (gridHttpRequest) {
    var srv = this;

    srv.getPaging = function (scope, dataLength, pageNumber, pageSize, callback) {

        scope.pagination = {
            last: pageSize + 1,
            currentPage: pageNumber + 1
        };
        //how much items per page to show  
        var show_per_page = pageSize;
        //getting the amount of elements inside content div  
        var number_of_items = dataLength;
        //calculate the number of pages we are going to have  
        var number_of_pages = Math.ceil(number_of_items / show_per_page);
        scope.number_of_pages = number_of_pages;
        scope.pagination.last = number_of_pages;
        scope.pages = [];
        if (pageNumber == 5)
            pageNumber = 0;
        var current_link = pageNumber;
        //if (current_link != 1)
        //    current_link -= 1;
        // var pageCount = new Object();
        if (number_of_pages <= 5) {
            while (number_of_pages > current_link) {

                current_link++;
                scope.pages.push(current_link);
            }
        } else {
            if (5 > current_link) {
                while (5 > current_link) {
                    if (current_link < number_of_pages) {
                        current_link++;
                        scope.pages.push(current_link);
                    }
                }
                scope.pages.push('...');
            }
            else {
                if (number_of_pages > pageNumber) {
                    {
                        while (5 + pageNumber > current_link) {
                            if (current_link <= number_of_pages) {
                                scope.pages.push(current_link);
                                current_link++;
                            } else {
                                return;
                            }
                        }
                        if (current_link != number_of_pages)
                            scope.pages.push('...');
                    }
                }

            }
        }
        if (callback)
            callback(number_of_pages);
    };


    return srv;
}]);

    /*
    //put this code on your controller


                paging.getPaging($scope, data.resultSet.collectionCount, $scope.pageNumber, $scope.pageSize, function (number_of_pages) {
                    $scope.totalCount = number_of_pages;
            });



             //and put this code on your html paging place

         
                <div class="grid-block align-center formFooterPlace">

                    <div class="grid-block gridCustomFooter">
                        <br>
                        <div class="grid-block">

                            <div class="medium-1 large-1 grid-content">
                                <div class="grid-block">
                                    <div class="medium-6 large-6 grid-content paginstionTxtRowTotal">
                                        کل
                                    </div>
                                    <div class="medium-6 large-6 grid-content paginstionTxtRowTotal">
                                        {{totalCount}}
                                    </div>
                                </div>
                            </div>
                            <div class="medium-9 large-9 grid-content">
                                <ul class="paginationCustom">
                                    <li><a href="" ng-click="setCurrent(currentPage-1)">&laquo;</a></li>
                                    <li ng-repeat="page in pages" ng-class="page == currentPage ? 'select' : ''"><a href="" ng-click="setCurrent(page)">{{page}}</a></li>
                                    <li><a href="" ng-click="setCurrent(currentPage+1)">&raquo;</a></li>
                                </ul>
                            </div>
                            <div class="medium-2 large-2 grid-content">
                                <div class="inline-label">
                                    <span class="form-label">{{pages.toString()}}</span>
                                    <input class="formInputDefault" placeholder="صفحه" ng-model="goPage" ng-enter="setCurrent(goPage)">

                                </div>
                            </div>
                        </div>
                    </div>


                </div>


    */