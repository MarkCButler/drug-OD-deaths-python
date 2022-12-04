'use strict';

// Import the datatables library and its dependency jquery.
import $ from 'jquery';
import 'datatables.net-bs5';

import {displayAppError, HTTPError} from './errors';

const tableMetadata = [
  {
    tablePaneId: 'od-deaths-table-pane',
    tableId: 'od-deaths-table',
    url: '/tables/od-deaths-table',
    interactive: true
  },
  {
    tablePaneId: 'population-table-pane',
    tableId: 'population-table',
    url: '/tables/population-table',
    interactive: true
  },
  {
    tablePaneId: 'od-code-table-pane',
    tableId: 'od-code-table',
    url: '/tables/od-code-table',
    interactive: false
  }
];

const datatableOptions = {
  order: []
};


async function addTable(tableDiv, {tableId, url, interactive}) {
  try {
    url = url + '?id=' + tableId;
    const response = await fetch(url);
    if (response.ok) {
      tableDiv.innerHTML = await response.text();
      addBootstrapStyle(tableId);
      if (interactive) {
        makeInteractive(tableId);
      }
    } else {
      throw new HTTPError(`status code ${response.status}`);
    }
  } catch (error) {
    displayAppError(error, tableDiv, tableId);
  }
}


function addBootstrapStyle(tableId) {
  const table = document.getElementById(tableId);
  const classArgs = ['table', 'table-primary', 'table-striped'];
  table.classList.add(...classArgs);
}


function makeInteractive(tableId) {
  // The datatables library used to make the table interactive is a jquery
  // plug-in, and so jquery syntax is used in calling the library.
  const selector = '#' + tableId;
  $(selector).DataTable(datatableOptions);        // eslint-disable-line new-cap
}


tableMetadata.forEach(metadata => {
  const tableDiv = document.getElementById(metadata.tablePaneId);
  void addTable(tableDiv, metadata);
});
