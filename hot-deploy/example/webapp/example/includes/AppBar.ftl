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
<#if (requestAttributes.externalLoginKey)?exists><#assign externalKeyParam = "?externalLoginKey=" + requestAttributes.externalLoginKey?if_exists></#if>
<#if (externalLoginKey)?exists><#assign externalKeyParam = "?externalLoginKey=" + requestAttributes.externalLoginKey?if_exists></#if>

<#if userLogin?has_content>
  <div class="metro">
    <div class="container">
        <div class="row">
          <input type="text" id="menu-search" class="col-lg-offset-4 col-md-offset-4 col-sm-offset-4 col-lg-3 col-md-3 col-sm-4" placeholder="Search in Applications" data-filter=".filter-items-menus" data-smart-change/>
          <div class="col-lg-12">
            <ul id="page-title" class="breadcrumb no-separator">
              <li>
                <a href="#" toggle-menu="up">
                  <i class="fa fa-th fa-lg"></i> Menu
                </a>
              </li>
              <li class="pull-right no-separator">
                <a href="<@ofbizUrl>logout</@ofbizUrl>" title="${uiLabelMap.CommonLogout}"><i class="fa fa-sign-out fa-lg"></i></a>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-2 col-md-2 col-sm-3">
            <div class="section">
              <ul class="menu-nav" data-spy="affix" data-offset-top="57">
              <li class="favorites">
                <label class="favorites-label">
                  <input type="checkbox" data-toggle-hide=".hide-menu" class="pull-left">${uiLabelMap.ExampleMenusFavorites}
                </label>
              </li>
              <#assign nothing = appBarMenuFacade.setMapKeyFilter("main_menu") />
              <#assign nothing = appBarMenuFacade.setSortOrder("caSequenceNum") />
                <div class="menu-items ${(appBarMenuFacade.fields.contentName)!} " id="${(appBarMenuFacade.fields.contentName)!}">
                <#list appBarMenuFacade.get("subcontent_all") as mainMenu>
                  <@renderContentAsText contentId=mainMenu.fields.contentId/>
                </#list>
                </div>
              </ul>
            </div>
          </div>
          <div class="col-lg-10 col-md-10 col-sm-9">
            <div class="section">
              <#list appBarMenuFacade.get("subcontent_all") as mainMenu>
                 <#assign nothing = mainMenu.setMapKeyFilter("sub_menu") />
                 <#assign nothing = mainMenu.setSortOrder("caSequenceNum") />
                 <div class="menu-items ${(mainMenu.fields.contentName)!} " id="${(mainMenu.fields.contentName)!}">
                 <#assign ignore = parameters.put("isFirstMenu", "Y")!/> 
                <#list mainMenu.get("subcontent_all") as navigationMenu>
                  <@renderContentAsText contentId=navigationMenu.fields.contentId/>
                  <#if "Y" == parameters.isFirstMenu!"N"><#assign ignore = parameters.put("isFirstMenu", "N")!/></#if>
                </#list>
                </div>
              </#list>
            </div>
          </div>
        </div>
    </div>
  </div>
</#if>