<div class="panel panel-default">
  <div class="panel-heading">
    <span class="panel-buttons">
      <ul>
        <li><button type="button" class="btn btn-default" data-dialog-href="<@ofbizUrl>EditExample?exampleId=${parameters.exampleId!}</@ofbizUrl>" data-dialog-width="half" title="${uiLabelMap.CommonEdit}">${uiLabelMap.CommonEdit}</button></li>
      </ul>
    </span>
    <span class="panel-title">${parameters.exampleId!}</span>
    <#if example.statusId?exists && statusItem?exists>
      <span class="panel-status">
        <div class="btn-group status-button">
          <button type="button" class="btn btn-success btn-xs dropdown-toggle relative" data-toggle="dropdown">${(statusItem.description)!(statusItem.statusId)} <i class="fa fa-caret-down fa-lg"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-arrow order-status-dropdown" role="menu">
            <li>
              <div id="example-status-history">
                <table class="table table-striped table-bordered table-hover">
                  <tbody>
                    <tr>
                      <td>${(statusItem.description)!(statusItem.statusId)}</td>
                      <td>${(.now?string("MM-dd-yyyy hh:mm a"))!"N/A"}</td>
                      <td>Admin User</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          </ul>
        </div>
      </span>
    </#if>
  </div>
  <div class="panel-body">
    <ul class="info-tiles list-unstyled clearfix">
      <li>
        <dl class="dl-horizontal dl-small">
          <dt>${uiLabelMap.CommonName}:</dt>
          <dd>${(example.exampleName)!("N/A")}</dd>
          <dt>${uiLabelMap.CommonDescription}:</dt>
          <dd>${(example.description)!("N/A")}</dd>
          <dt>${uiLabelMap.CommonType}:</dt>
          <dd>${(exampleType.description)!("N/A")}</dd>
        </dl>
      </li>
      <li>
        <dl class="dl-horizontal dl-small">
          <dt>${uiLabelMap.CommonSize}:</dt>
          <dd>${(example.exampleSize)!("N/A")}</dd>
          <dt>${uiLabelMap.CommonDate}:</dt>
          <dd>${(example.exampleDate?string("MM-dd-yyyy hh:mm a"))!"N/A"}</dd>
        </dl>
      </li>
      <li>
        <dl class="dl-horizontal dl-small">
          <dt>${uiLabelMap.CommonComments}:</dt>
          <dd>${(example.comments)!("N/A")}</dd>
        </dl>
      </li>
    </ul>
  </div>
</div>