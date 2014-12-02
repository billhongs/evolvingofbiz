
result = dispatcher.runSync("getOrderSearchFacets", ['keyword': parameters.keyword, 'days': parameters.days, 'status': parameters.status, 'channel': parameters.channel, 'customer': parameters.customer, 'userLogin':userLogin]);
context.putAll(result.result);
result = dispatcher.runSync("searchOrderByFilters", ['keyword': parameters.keyword, 'days': parameters.days, 'status': parameters.status, 'channel': parameters.channel, 'customer': parameters.customer, 'viewSize': parameters.viewSize, 'viewIndex': parameters.viewIndex, 'userLogin':userLogin]);
context.putAll(result.result);
