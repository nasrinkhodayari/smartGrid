
function convertDisplayNameToFarsi(fieldName) {
    
    if (Object.keys(publicDisplayNames).indexOf(fieldName) != -1) {
        return publicDisplayNames[fieldName];
    }
    else {
        return fieldName;
    }
}

function createSortField(objName, gridName) {
    
    var sortField = objName;
    return sortField;
}
function createFieldValue(objName) {
    var sortField = objName;
    return sortField;
}

function createSearchField(objName, gridName) {

    switch (gridName) {
        case 'sabt':
            {

                break;
            }
        case 'transit': {

            return "searchData." + objName;

            break;
        }
        case 'sodour': {

            return "searchData." + objName;

            break;
        }
        default:
            return "searchData." + objName;
            break;
    }

}

function getDefaultSortField(gridName) {
    var sortField = 'id';
    return sortField;
}

var gridDefaultOptions = {
    'defaultTinyColSize': '5',
    'defaultTinyColSizeBigGrid': '3',
    'defaultColSize': '20',//range 5-40
    'defaultColSizeBigGrid': '10',
    'defaultcolPriority': '100',
    'defaultDetailBtnSize': '5',//range 3-5,
    'defaultActionColSize': '5',//6
    'defaultActionColSizeBigGrid': '1',//6
    'defaultActionEditColSize': '4',//4
    'defaultSelectAllBtnSize': '5',//range 3-5,
    'defaultSortIcon': "reorder",
    'downSortIcon': 'down-open-mini',
    'upSortIcon': 'up-open-mini',
    'pagingSizeLength': 5,
    'defaultTotalCount': 10
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


