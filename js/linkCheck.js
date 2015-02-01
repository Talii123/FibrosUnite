
var findUrls = function(checkAllURLs) {
  var $urlSelector,
      urls,
      facebookFilter;

  $urlSelector = $("[href]");
  urls = $($urlSelector);
    
  facebookFilter = function() {
    href=this.href; 
    //return href.search("facebook.com") >= 0;    
    return /https?\:\/\/(www.|m.)?facebook.com\//.test(href);
  };

  if (!checkAllURLs) {
    console.log("before filtering, urls: ", urls);
    urls = urls.filter(facebookFilter);
    console.log("after filtering, urls: ", urls);
  }
  
  return urls.map(function() {return this.href;});
  
}

var checkUrls = function(urls) {
  var URL_CHECK_SERVICE_URL = '/sysadmin/URLCheck';

  $.post(URL_CHECK_SERVICE_URL, urls, function(data) {
    alert("URLs submitted for checking");
  });
}


$(function() {
  var urls;
  console.log("beginning to look for broken links");
  urls = findUrls();
  console.log("found these urls: ", urls);
  
  checkUrls(urls);
  //console.log("done looking for broken links");
});