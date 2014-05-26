
var TagFilter = Backbone.Model.extend({});

var TagFilterList = Backbone.Collection.extend({
	model: TagFilter
});

var theTagFilterList = new TagFilterList();
var tagFilters = [{
	tagName : "Surgery",
	ids: [1, 2, 3]
}, {
	tagName : "Chemo",
	ids: [4, 5]
}]
theTagFilterList.reset(tagFilters);

var TagFilterOptionView = Backbone.View.extend({
	tagName: "option",

	initialize: function(optionModel) {
		this.listenTo(optionModel, "change", this.updateCount);
	},

	render: function() {
		var ids = this.model.get("ids"),
			tagName = this.model.get("tagName");
		//return "<option value='" + tagName + "'>" + tagName + " (" + ids.length +")</option>" ;

		this.$el.attr({"value" : tagName}).html(tagName + " (" + ids.length +")");
		return this;
	},
	updateCount: function(aCount) {
		console.log("updateCount... arugments:", arguments);
		if (!aCount) aCount = 0;

		this.$el.html(tagName + " ("+ aCount+")");
	}
});
var TagFilterSelectorView = Backbone.View.extend({
	//viewCollection = [],
	//tagName: "select",

	/*render: function() {
		this.collection.forEach(this.$el.append());
		this.$el.
	}*/

	initialize: function() {
		this.listenTo(this.collection, "change", this.fireFilterEvent);
	},

	events: {
		"change select" : "fireFilterEvent"/*,
		"click button" : "fireFilterEvent"*/
	},

	render : function() {
		console.log("beginning rendering...");
		console.log("collection size: ", this.collection.length);
		this.$selector = $("<select/>");
		this.$el.append(this.$selector);
		this.collection.forEach(this.renderOne, this);
		this.$el.append($("<button>Click Me!</button>"));
		console.log("done rendering.");
		return this;

	},
	renderOne: function(tagFilter){
	  var tagFilterOptionView = new TagFilterOptionView({model: tagFilter});
	  console.log("rendering one..");
	  this.$selector.append(tagFilterOptionView.render().$el);
	},
	/*render: function() { 
		console.log("beginning rendering...");
		console.log("collection size: ", this.collection.length);
		this.collection.forEach(this.renderOne, this);
		console.log("done rendering.");
		return this;
	},
	renderOne: function(tagFilter){
	  var tagFilterOptionView = new TagFilterOptionView({model: tagFilter});
	  console.log("rendering one..");
	  this.$el.append(tagFilterOptionView.render().$el);
	},*/
	fireFilterEvent: function(filterEvent) {
		console.log("fireFilterEvent");
		filterEvent = filterEvent || {
			"type" : "filter",
			"isTest" : "true",
			"isOverriden" : "false"
		};
		this.trigger("filter", filterEvent);
		this.trigger("filter");
	},
	testUpdateCount: function(aCount) {
		this.collection.forEach(function(anOptionModel) {
			anOptionModel.set({"count" : aCount});
		}, this);
	}
});

var theTagFilterSelectorView = new TagFilterSelectorView({
	id: "AddTagFilterSelector",
	collection: theTagFilterList
});

var Doc = Backbone.Model.extend({});
var DocumentList = Backbone.Collection.extend({
	model: Doc
});
var documentList = new DocumentList();
var DocumentListView = Backbone.View.extend({

	addFilter: function(aFilter) {
		this.listenTo(aFilter, "filter", this.updateList);
		aFilter.on("filter", this.test, this);
	},
	updateList : function() {
		console.log("updateList(); arguments: ", arguments);
	},
	test: function() {
		console.log("test(); arguments: ", arguments);
	}

});
var documentListView = new DocumentListView({
	collection: documentList
});

documentListView.addFilter(theTagFilterSelectorView);

console.log("firing test event");
theTagFilterSelectorView.fireFilterEvent();
console.log("done firing test event");

//theTagFilterSelectorView.testUpdateCount(426);


/*console.log("begin test!");
var aFilter = new TagFilter(tagFilters[0]);
var aFilterView = new TagFilterOptionView({model: aFilter});
console.log("aFilter: ", aFilterView.render().$el.html());

var test = theTagFilterSelectorView.render().$el.html();
console.log("end test!");
console.log("test: ", test );*/

$("#appliedTags .tagsList").before(theTagFilterSelectorView.render().el);