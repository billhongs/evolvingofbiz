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
<#-- If PreBody included in ajax screen decorator then no need to add the html, head and body tag-->
<#if !isAjaxRequest?has_content || !isAjaxRequest>
  <html>
    <#if session.getAttribute("userLogin")?has_content>
      <#if page.permission?has_content && page.action?has_content && !security.hasEntityPermission(page.permission, page.action, session)>
        <#assign hasPermission = false>
      <#elseif userHasPermission?has_content && !(userHasPermission?default('N') == 'Y')>
        <#assign hasPermission = false>
      </#if>
    </#if>
    <head>
      <title>${layoutSettings.companyName}<#if hasPermission?default(true)><#if (page.titleProperty)?has_content>: ${StringUtil.wrapString(uiLabelMap[page.titleProperty])}<#else>${(page.title)?if_exists}</#if></#if></title>
      <meta name="viewport" content="width=device-width, user-scalable=no"/>
      <#if webSiteFaviconContent?has_content>
        <link rel="shortcut icon" href="<@renderContentAsText contentId='${webSiteFaviconContent.getString("contentId")}'/>">
      <#else>
        <link rel="shortcut icon" href="/images/ofbiz.ico">
      </#if>
      <#list styleSheets as styleSheet>
        <link rel="stylesheet" href="${styleSheet}" type="text/css"/>
      </#list>
      <#list javaScripts as javaScript>
        <script type="text/javascript" src="${javaScript}" ></script>
      </#list>
    </head>
    <body data-spy="scroll" data-target=".scroll-spy" data-offset="125"> 
      <div class="menus tilesBackground" style="display:none;">
        <#include "AppBar.ftl"/>
      </div>
      <div id="notification-messages">
        ${screens.render("component://example/widget/CommonScreens.xml#Messages")}
      </div>
    </#if>
    <div class="container menus" id="container">
      <#if hasPermission?default(true)>
        <#if userLogin?has_content>
          <div class="row">
            <div class="col-sm-12">
              <ul id="page-title" class="breadcrumb">
                <li>
                  <a href="#" toggle-menu="down">
                    <i class="fa fa-th fa-lg"></i> Menu
                  </a>
                </li>
                <#if hasVersion?has_content>
                  <#if !isAjaxRequest?has_content || !isAjaxRequest>
                    <#if previousTitleProperty?has_content>
                      <li class="previous"><a href="<@ofbizUrl>${previousUrl?default("#")}</@ofbizUrl>">${StringUtil.wrapString(uiLabelMap[previousTitleProperty])}</a></li>
                    </#if>
                  <#else>
                    <li><a href="#" class="previous btn-link flipper-close"></a></li>
                  </#if>
                  <li class="active dropdown">
                    <a href="#" id="current-version" class="dropdown-toggle" data-toggle="dropdown">${currentVersion} <b class="caret"></b></a>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="currentVersion">
                      <#list versionMap.keySet() as version>
                        <li <#if "${currentVersion}" == "${version}"> class="active"</#if> ><a href="${versionMap[version]}">${version}</a></li>
                      </#list>
                    </ul>
                  </li>
                <#elseif titleProperty?has_content>
                  <#if !isAjaxRequest?has_content || !isAjaxRequest>
                    <#if previousTitleProperty?has_content>
                      <li class="previous"><a href="<@ofbizUrl>${previousUrl?default("#")}</@ofbizUrl>">${StringUtil.wrapString(uiLabelMap[previousTitleProperty])}</a></li>
                    </#if>
                  <#else>
                    <li><a href="#" class="previous btn-link flipper-close"></a></li>
                  </#if>
                  <li class="active"><span class="flipper-title">${StringUtil.wrapString(uiLabelMap[titleProperty])}</span></li>
                  <li class="pull-right no-separator">
                    <a href="<@ofbizUrl>logout</@ofbizUrl>" title="${uiLabelMap.CommonLogout}"><i class="fa fa-sign-out fa-lg"></i></a>
                  </li>
                </#if>
              </ul>
            </div>
          </div>
        <#else>
          <div class="row">
            <div class="col-lg-12">
              <ul id="page-title" class="breadcrumb">
                <li>
                  <a href="#">
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </#if>
      </#if>
        <div class="row">
          <div class="col-lg-12 header-col">
            <div id="main-content">
