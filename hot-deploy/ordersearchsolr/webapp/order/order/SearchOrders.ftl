<#--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

<div class="row" id="main-page">
  <div class="col-lg-3 col-md-3">
    <section class="well well-sm">
      <form method="get" action="<@ofbizUrl>FindOrders</@ofbizUrl>" >
        <div class="form-group row">
          <div class="col-lg-12 col-md-12">
            <input type="text" class="form-control" value="${parameters.keyword?if_exists}" name="keyword" placeholder="Order/ Customer Name"/>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-lg-12 col-md-12">
            <button type="submit" class="btn btn-primary relative">${uiLabelMap.CommonFind}
              <span class="abs" style="display:none"></span>
            </button>
          </div>
        </div>
      </form>
      <#if facetStatus?has_content>
        <div class="row">
          <div class="col-lg-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <span class="panel-title">${uiLabelMap.CommonStatus}</span>
                <span class="panel-buttons">
                  <ul>
                    <li>
                      <#if parameters.status?has_content><a class="btn btn-default" href="<@ofbizUrl>FindOrders</@ofbizUrl>?${clearStatusUrl}"  data-update-url="<@ofbizUrl>FindOrders</@ofbizUrl>?${clearStatusUrl}" data-facet-update="#main-page"><span class="h5">${uiLabelMap.CommonClear}</span></a></#if></h4>
                    </li>
                  </ul>
                </span>
              </div> 
              <div class="panel-body">
                <#list facetStatus as status>
                  <div class="checkbox">
                    <label for="shipMeth">
                      <input type="checkbox" value="${status.statusId}" data-click-navigation=".status_${status_index}" <#if parameters.status?has_content><#if parameters.status?contains(status.statusId)>checked</#if></#if>>
                      <a href="<@ofbizUrl>FindOrders</@ofbizUrl>?${status.urlParam}" class="status_${status_index}"  >
                        <#if status.description?exists>${status.description}<#else>${status.statusId}</#if> (${status.statusCount?if_exists})
                      </a>
                    </label>
                  </div>
                </#list>
              </div>
            </div>
          </div>
        </div>
      </#if>
      <#if facetChannels?has_content>
        <div class="row">
          <div class="col-lg-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <span class="panel-title">${uiLabelMap.OrderSalesChannel}</span>
              </div> 
              <div class="panel-body">
                <#list facetChannels as channel>
                  <div class="radio">
                    <label for="channel">
                      <input type="radio" value="${channel.channelId}" data-click-navigation=".channel_${channel_index}" <#if parameters.channel?has_content><#if parameters.channel?contains(channel.channelId)>checked</#if></#if>>
                      <a href="<@ofbizUrl>FindOrders</@ofbizUrl>?${channel.urlParam}" class="channel_${channel_index}" >
                        <#if channel.description?exists>${channel.description}<#else>${channel.channelId}</#if> (${channel.channelCount?if_exists})
                      </a>
                    </label>
                  </div>
                </#list>
              </div>
            </div>
          </div>
        </div>
      </#if>
    </section>
  </div>
  <div class="col-lg-9 col-md-9">
    <#if orderList?has_content>
      <div class="panel panel-default">
        <div class="panel-heading">
          <span class="panel-title">${uiLabelMap.CommonSearchResults}</span>
        </div>
        <#if orderList?has_content>
          <table class="table table-striped table-condensed table-hover">
            <thead>
              <tr>
                <th>${uiLabelMap.OrderOrder}</th>
                <th>${uiLabelMap.OrderDate}</th>
                <th>${uiLabelMap.OrderCustomer}</th>
                <th>${uiLabelMap.OrderItems}</th>
                <th>${uiLabelMap.CommonAmount}</th>
              </tr>
            </thead>
            <tbody <#if listSize &gt; viewSize> class="scrollPagination" data-no-more-result="#no-more-orders" data-loading-result="#loading-orders" scrollpagination="enabled" data-content-page="ListFilteredOrders?${completeUrlParamForPagination?if_exists}" data-view-size="${viewSize}" data-view-index="${viewIndex}" data-list-size="${listSize}" data-scroll-ready="true"</#if>>
              <#list orderInfoList as orderInfo>
                <tr id="order-detail-row-${orderInfo.orderId}">
                  <td>
                    <a href="<@ofbizUrl>orderview?orderId=${orderInfo.orderId}&emailId=${(orderInfo.emailAddress)?if_exists}</@ofbizUrl>" target="_blank" title="${orderInfo.orderId}" menu="${StringUtil.wrapString(uiLabelMap[titleProperty])}"
                      data-flipper-href="<@ofbizUrl>orderview?orderId=${orderInfo.orderId}</@ofbizUrl>">${orderInfo.orderId}
                    </a>
                    <span class="label <#if orderInfo.statusId == "ORDER_HOLD">label-warning<#elseif orderInfo.statusId == "ORDER_COMPLETED">label-success<#elseif orderInfo.statusId == "ORDER_APPROVED">label-info<#elseif orderInfo.statusId == "ORDER_CANCELLED">label-danger<#else>label-default</#if>">
                      ${orderInfo.statusDesc?default(orderInfo.statusId)}
                    </span>
                    <label class="pull-right-lg pull-right-md">via ${orderInfo.channel.get("description", locale)?default("N/A")}</label>
                  </td>
                  <td>
                    <label>${orderInfo.orderDate?string("MM-dd-yyyy hh:mm a")}</label>
                  </td>
                  <td>
                    <a href="<@ofbizUrl>CustomerProfile?partyId=${orderInfo.partyId}</@ofbizUrl>" target="_blank">
                      ${orderInfo.customerName?default(orderInfo.partyId)}
                    </a>
                    <span class="fa fa-info-circle" data-tooltip-target="#email-${orderInfo.orderId}" data-tooltip-title="Email"></span>
                    <div id="email-${orderInfo.orderId}" class="hide">
                      ${(orderInfo.emailAddress)?if_exists}
                    </div>
                  </td>
                  <td>${orderInfo.orderSize?string.number}</td>
                  <td><@ofbizCurrency amount=orderInfo.grandTotal isoCode=orderInfo.uom/></td>
                </tr>
              </#list>
            </tbody>
          </table>
        </#if>
        </div>
        <a href="#top" class="top-link">${uiLabelMap.OrderCommonTopOfPage}</a>
        <#if listSize &gt; viewSize>
          <div class="alert alert-info loading" id="loading-orders">${uiLabelMap.OrderCommonLoading}</div>
          <div class="alert alert-info loading" id="no-more-orders">${uiLabelMap.OrderCommonNoMoreResults}</div>
        </#if>
        <#else>
          <div class="panel panel-default">
            <div class="panel-heading">
              <span class="panel-title">${uiLabelMap.CommonSearchResults}</span>
            </div>
            <div class="panel-body">
              <h5>No Keyword Matches The Search Criteria</h5>
            </div>
          </div>
        </#if>
      </div>
    </div>
  </div>
</div>