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

<#if exampleDetailList?has_content>
  <#list exampleDetailList as example>
    <li class="col-lg-4 col-md-4 pushdown">
      <a href="<@ofbizUrl>ViewExample?exampleId=${example.exampleId!}</@ofbizUrl>" data-flipper-href="ViewExample?exampleId=${example.exampleId!}" menu="${StringUtil.wrapString(uiLabelMap[titleProperty])}"
          title="${example.exampleName!(example.exampleId!)}" target="_blank">
        <div class="thumbnail">
          <ul class="list-unstyled row">
            <#if example?has_content>
              <li class="col-lg-8 col-md-8">
                <strong>${example.exampleName!(example.exampleId!)}</strong>
              </li>
            </#if>
          </ul>
        </div>
      </a>
    </li>
  </#list>
</#if>