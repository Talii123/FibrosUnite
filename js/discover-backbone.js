
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
	render: function() {
		var ids = this.model.get("ids"),
			tagName = this.model.get("tagName");
		//return "<option value='" + tagName + "'>" + tagName + " (" + ids.length +")</option>" ;

		this.$el.attr({"value" : tagName}).html(tagName + " (" + ids.length +")");
		return this;
	}
});
var TagFilterSelectorView = Backbone.View.extend({
	//viewCollection = [],
	tagName: "select",

	/*render: function() {
		this.collection.forEach(this.$el.append());
		this.$el.
	}*/

	render: function() { 
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
	}	
});

var theTagFilterSelectorView = new TagFilterSelectorView({
	id: "AddTagFilterSelector",
	collection: theTagFilterList
});


/*console.log("begin test!");
var aFilter = new TagFilter(tagFilters[0]);
var aFilterView = new TagFilterOptionView({model: aFilter});
console.log("aFilter: ", aFilterView.render().$el.html());

var test = theTagFilterSelectorView.render().$el.html();
console.log("end test!");
console.log("test: ", test );*/

$(".tagsList").before(theTagFilterSelectorView.render().el);