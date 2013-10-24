if ( typeof window.app === 'undefined' ) {
    window.app = {};
}

//bindings
window.app.bindings = {};

//total Payments viewmodel
var totalPaymentsViewModel = function()
{
    this.heading = "Total Payments";
    this.total_payments = ko.observable();
    this.hasValue = ko.observable(false);
};

//payment week viewmodel
var dayWeekViewModel = function()
{
    this.heading = "Payments this week";
    this.days = ko.observableArray([]);
    this.hasValue = ko.observable(false);

    this.setDays = function(days, hasValue)
    {
        this.days(days);
        this.hasValue(hasValue);
    };
};

//best seller view model
var bestSellerViewModel = function()
{
    this.name = ko.observable();
    this.info = ko.observable();
    this.heading = "Best Seller";
    this.hasValue = ko.observable(false);

    this.set = function(count, name, formated, hasValue)
    {
        if ( count > 0 && hasValue == true )
        {
            this.name(name);
            this.info('x<span class="big-font">'+count+'</span> quantity sold<br />a total of<br/><span class="big-font">'+formated+'</span>');
            this.hasValue(hasValue);
        }
    }
};

//product list view model
var Product = function(data)
{
    this.name = ko.observable(data.name);
    this.price = ko.observable(data.price);
    this.soldCount = ko.observable(data.soldCount);
    this.soldTotal = ko.observable(data.soldTotal);
};
var productListViewModel = function()
{
    this.heading = "Product List";
    this.products = ko.observableArray([]);
    this.hasValue = ko.observable(false);

    this.setHeaders = function()
    {
        this.products.removeAll();
        this.products.push(
            new Product({
                name:"<b>Name</b>", 
                price:"<b>Price</b>", 
                soldCount:"<b>Qty.</b>", 
                soldTotal:"<b>Total</b>"
            })
        );
    };

    this.setLast = function(totalSoldCount, totalSoldPrice)
    {
        this.products.push(
            new Product({
                name:"&nbsp;", 
                price:"&nbsp;", 
                soldCount:totalSoldCount, 
                soldTotal:totalSoldPrice
            })
        );
    };

    this.setProducts = function(model)
    {
        this.products.push( new Product(model) );
    };
};

//register bindings
window.app.bindings.totalPaymentsViewModel = new totalPaymentsViewModel();
window.app.bindings.dayWeekViewModel = new dayWeekViewModel();
window.app.bindings.bestSellerViewModel = new bestSellerViewModel();
window.app.bindings.productListViewModel = new productListViewModel();

//apply bindings
ko.applyBindings(window.app.bindings.totalPaymentsViewModel, $("#total_payments")[0]);
ko.applyBindings(window.app.bindings.dayWeekViewModel, $('#this_week_payments')[0]);
ko.applyBindings(window.app.bindings.bestSellerViewModel, $("#best_seller")[0]);
ko.applyBindings(window.app.bindings.productListViewModel, $("#product_list")[0]);

//single object bindings
window.app.bindings.formSearch = {
    placeholderVal: ko.observable("Loading forms..."),
    show_close: ko.observable(false),
    showClose: function() {
        this.show_close(true);
    },
    hideClose: function() {
        this.show_close(false);
    },
    clear: function() {
        typeahead.val("");
        $(".form-search .tt-hint").val("");
    },
    pickform: function(data, e) {
        console.log("cache", window.app.formView.cache.forms);

        window.app.bindings.contentMsg.changeMsg("Initializing Formpicker...");

        var el = $(e.target);
        if ( typeof el.attr('data-ladda') === 'undefined' && el.hasClass('ladda-button') )
        {
            el.ladda( 'start' );
        }

        JF.FormPicker({
            title: 'Pick your Form to calculate payments',
            showPreviewLink: true,
            sort: 'created_at',
            sortType: 'DESC',
            multiSelect: false,
            onSelect: function(r) {
                var selectedFormObj = r[0]
                  , data = {
                    url: selectedFormObj.url,
                    id: selectedFormObj.id
                  };
                console.log(selectedFormObj);
                el.ladda('destroy');
                window.app.formView.getPayments(data);
                window.app.bindings.contentMsg.changeMsg("Reading Form data...");
            },
            onClose: function()
            {
                el.ladda('destroy');
            }
        });
    }
};

window.app.bindings.contentMsg = {
    msg: ko.observable("No Payment history to display"),
    show_msg: ko.observable(true),
    changeMsg: function(msg) {
        this.msg(msg);
        this.show();
    },
    show: function() {
        this.show_msg(true);
    },
    hide: function() {
        this.show_msg(false);
    }
};

window.app.bindings.loader = {
    show: ko.observable(true),
    hide: function() {
        this.show(false);
    }
};

ko.applyBindings( window.app.bindings.loader, $("#loader")[0]);
ko.applyBindings( window.app.bindings.formSearch, $("#form_search")[0]);
ko.applyBindings( window.app.bindings.contentMsg, $(".notif-history-content")[0]);    