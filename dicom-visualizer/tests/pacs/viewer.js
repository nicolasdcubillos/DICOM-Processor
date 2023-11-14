// Do not warn if these variables were not defined before.
/* global dwv */

// call setup on DOM loaded
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

let _app = null;
let _tools = null;
let coordinates = [];
let files = null;
let zLevel = 0;


// viewer options
let _layout = "one";
const _dicomWeb = false;

/**
 * Setup simple dwv app.
 */
function process() {
  console.log('PROCESS: ', coordinates);
  if (files != null) {
    console.log(_app.Slice(coordinates, files));
  }
}


function viewerSetup() {
  // logger level (optional)
  dwv.logger.level = dwv.logger.levels.INFO;
  dwv.decoderScripts.jpeg2000 = "../../decoders/pdfjs/decode-jpeg2000.js";
  dwv.decoderScripts["jpeg-lossless"] =
    "../../decoders/rii-mango/decode-jpegloss.js";
  dwv.decoderScripts["jpeg-baseline"] =
    "../../decoders/pdfjs/decode-jpegbaseline.js";
  dwv.decoderScripts.rle = "../../decoders/dwv/decode-rle.js";

  // // example private logic for roi dialog
  // dwv.customUI.openRoiDialog = function (meta, cb) {
  //   console.log('roi dialog', meta);
  //   const textExpr = prompt('[Custom dialog] Label', meta.textExpr);
  //   if (textExpr !== null) {
  //     meta.textExpr = textExpr;
  //     cb(meta);
  //   }
  // };

  // // example private logic for time value retrieval
  // dwv.TagValueExtractor.prototype.getTime = function (elements) {
  //   let value;
  //   const time = elements['ABCD0123'];
  //   if (typeof time !== 'undefined') {
  //     value = parseInt(time.value[0], 10);
  //   }
  //   return value;
  // };

  // // example labelText override
  // dwv.defaults.labelText.rectangle = {
  //   '*': '{surface}!',
  //   MR: '{surface}!!'
  // };

  // stage options
  let viewOnFirstLoadItem = true;

  // use for concurrent load
  const numberOfDataToLoad = 1;

  if (_layout === "one") {
    // simplest: one layer group
    addLayerGroups(1);
  } else if (_layout === "side") {
    // side by side
    addLayerGroups(2);
  } else if (_layout === "mpr") {
    // MPR
    viewOnFirstLoadItem = false;
    addLayerGroups(3);
  }

  // tools
  _tools = {
    Desplazar: {},
    Contraste: {},
    Mover: {},
    Opacidad: {},
    Draw: {
      options: ["Circle"]
    },
  };

  // app config
  const config = {
    viewOnFirstLoadItem: viewOnFirstLoadItem,
    tools: _tools,
  };
  // app
  _app = new dwv.App();
  _app.init(config);

  // bind events
  _app.addEventListener("loaderror", function (event) {
    console.error("load error", event);
  });
  _app.addEventListener("loadstart", function (event) {
    console.time("load-data-" + event.dataid);
    // update data view config
    const dataIds = [event.dataid];
    let configs;
    if (_layout === "one") {
      configs = getOnebyOneDataViewConfig(dataIds);
    } else if (_layout === "side") {
      configs = getOnebyTwoDataViewConfig(dataIds);
    } else if (_layout === "mpr") {
      configs = getMPRDataViewConfig(dataIds);
    }
    const viewConfigs = configs[event.dataid];
    for (let i = 0; i < viewConfigs.length; ++i) {
      _app.addDataViewConfig(event.dataid, viewConfigs[i]);
    }
  });
  const dataLoadProgress = new Array(numberOfDataToLoad);
  const sumReducer = function (sum, value) {
    return sum + value;
  };
  _app.addEventListener("loadprogress", function (event) {
    if (
      typeof event.lengthComputable !== "undefined" &&
      event.lengthComputable
    ) {
      dataLoadProgress[event.dataid] = Math.ceil(
        (event.loaded / event.total) * 100
      );
      document.getElementById("loadprogress").value =
        dataLoadProgress.reduce(sumReducer) / numberOfDataToLoad;
    }
  });
  _app.addEventListener("load", function (event) {
    if (!viewOnFirstLoadItem) {
      _app.render(event.dataid);
    }
  });
  _app.addEventListener("loaditem", function (event) {
    if (typeof event.warn !== "undefined") {
      console.warn("load-warn", event.warn);
    }
  });
  _app.addEventListener("loadend", function (event) {
    console.timeEnd("load-data-" + event.dataid);
  });

  let dataLoad = 0;
  const firstRender = [];
  _app.addEventListener("load", function (event) {
    // update UI at first render
    if (!firstRender.includes(event.dataid)) {
      // store data id
      firstRender.push(event.dataid);
      // log meta data
      if (event.loadtype === "image") {
        console.log(
          "metadata",
          getMetaDataWithNames(_app.getMetaData(event.dataid))
        );
        // add data row
        addDataRow(event.dataid);
        ++dataLoad;
        // init gui
        if (dataLoad === numberOfDataToLoad) {
          // select tool
          _app.setTool(getSelectedTool());

          const changeLayoutSelect = document.getElementById("changelayout");
          changeLayoutSelect.disabled = false;
          const resetLayoutButton = document.getElementById("resetlayout");
          resetLayoutButton.disabled = false;
          const smoothingChk = document.getElementById("changesmoothing");
          smoothingChk.disabled = false;
        }
      }
    }

    if (
      event.loadtype === "image" &&
      typeof _app.getMetaData(event.dataid)["00080060"] !== "undefined" &&
      _app.getMetaData(event.dataid)["00080060"].value[0] === "SEG"
    ) {
      // log SEG details
      logFramePosPats(_app.getMetaData(event.dataid));

      // example usage of a dicom SEG as data mask
      const useSegAsMask = false;
      if (useSegAsMask) {
        // image to filter
        const dataId = 0;
        const vls = _app.getViewLayersByDataId(dataId);
        const vc = vls[0].getViewController();
        const img = _app.getImage(dataId);
        const imgGeometry = img.getGeometry();
        const sliceSize = imgGeometry.getSize().getDimSize(2);
        // SEG image
        const segImage = _app.getImage(event.dataid);
        // calculate slice difference
        const segOrigin0 = segImage.getGeometry().getOrigins()[0];
        const segOrigin0Point = new dwv.Point([
          segOrigin0.getX(),
          segOrigin0.getY(),
          segOrigin0.getZ(),
        ]);
        const segOriginIndex = imgGeometry.worldToIndex(segOrigin0Point);
        const indexOffset = segOriginIndex.get(2) * sliceSize;
        // set alpha function
        vc.setViewAlphaFunction(function (value, index) {
          // multiply by 3 since SEG is RGB
          const segIndex = 3 * (index - indexOffset);
          if (
            segIndex >= 0 &&
            segImage.getValueAtOffset(segIndex) === 0 &&
            segImage.getValueAtOffset(segIndex + 1) === 0 &&
            segImage.getValueAtOffset(segIndex + 2) === 0
          ) {
            return 0;
          } else {
            return 0xff;
          }
        });
      }
    }
  });

  function renderTable(idDelete) {
    coordinates = coordinates.filter(item => item.id !== idDelete);
    //continuamos con la eliminacion en la tabla
    const coordinatesTable = document.querySelector(
      ".table_visualizer table tbody"
    );

    // Limpiar la tabla antes de agregar nuevos datos
    coordinatesTable.innerHTML = "";
    let id = 1;
    coordinates.forEach((coord) => {
      const newRow = document.createElement("tr");
      const idCell = document.createElement("td");
      const xCell = document.createElement("td");
      const yCell = document.createElement("td");
      const zCell = document.createElement("td");
      const buttonCell = document.createElement("td");

      idCell.textContent = id++;
      xCell.textContent = coord.x;
      yCell.textContent = coord.y;
      zCell.textContent = coord.z;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.id = 'deleteActionButton';
      deleteButton.addEventListener("click", function () {
        renderTable(coord.id);
      });

      buttonCell.appendChild(deleteButton);

      newRow.appendChild(idCell);
      newRow.appendChild(xCell);
      newRow.appendChild(yCell);
      newRow.appendChild(zCell);
      newRow.appendChild(buttonCell);

      coordinatesTable.appendChild(newRow);
    });
  }


  _app.addEventListener("*", function (event) {
    console.log("ENTRE NUEVO EVENTO")
    console.log(event);
  });
  _app.addEventListener("drawdelete", function (event) {
    renderTable(event.id);
  });
  _app.addEventListener("drawcreate", function (event) {
    // console.log(_app.getPositionFromPlanePoint(event.x, event.y));
    // eslint-disable-next-line curly
    if (coordinates.length < 5) {
      coordinates.push({
        // eslint-disable-next-line max-len
        x: event.layer.children[zLevel].children[event.layer.children[zLevel].children.length - 1].children[1].attrs.x,
        // eslint-disable-next-line max-len
        y: event.layer.children[zLevel].children[event.layer.children[zLevel].children.length - 1].children[1].attrs.y,
        z: zLevel,
        id: event.id,
      });
      const coordinatesTable = document.querySelector(
        ".table_visualizer table tbody"
      );

      // Limpiar la tabla antes de agregar nuevos datos
      coordinatesTable.innerHTML = "";
      let id = 1;
      coordinates.forEach((coord) => {
        const newRow = document.createElement("tr");
        const idCell = document.createElement("td");
        const xCell = document.createElement("td");
        const yCell = document.createElement("td");
        const zCell = document.createElement("td");
        const buttonCell = document.createElement("td");

        idCell.textContent = id++;
        xCell.textContent = coord.x;
        yCell.textContent = coord.y;
        zCell.textContent = coord.z;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.id = 'deleteActionButton';
        deleteButton.addEventListener("click", function () {
          //Lamado del evento delete
          // eslint-disable-next-line max-len
          const deleteActionButton = document.querySelector('#deleteActionButton');
          const eventoDrawDelete = new Event('drawdelete');
          eventoDrawDelete.id = coord.id;
          eventoDrawDelete.dataid = '0';
          eventoDrawDelete.type = 'drawdelete';
          deleteActionButton.dispatchEvent(eventoDrawDelete);
          renderTable(coord.id);
        });

        buttonCell.appendChild(deleteButton);

        newRow.appendChild(idCell);
        newRow.appendChild(xCell);
        newRow.appendChild(yCell);
        newRow.appendChild(zCell);
        newRow.appendChild(buttonCell);

        coordinatesTable.appendChild(newRow);
      });
    }
  });

  // function getPositionFromPlanePoint(x, y) {
  //   // keep third direction
  //   const k = this.getCurrentScrollIndexValue();
  //   const planePoint = new Point3D(x, y, k);
  //   // de-orient
  //   const point = this.planeHelper.getImageOrientedPoint3D(planePoint);
  //   // ~indexToWorld to not loose precision
  //   const geometry = this.view.getImage().getGeometry();
  //   const point3D = geometry.pointToWorld(point);
  //   // merge with current position to keep extra dimensions
  //   return this.getCurrentPosition().mergeWith3D(point3D);
  // }



  _app.addEventListener("positionchange", function (event) {
    zLevel = event.value[0][3];
    const input = document.getElementById("position");
    const values = event.value[1];
    let text = "(index: " + event.value[0] + ")";
    if (event.value.length > 2) {
      text += " value: " + event.value[2];
    }
    input.value = values.map(getPrecisionRound(2));
    // index as small text
    const span = document.getElementById("positionspan");

    //Keep postion on cordinates

  });

  // default keyboard shortcuts
  window.addEventListener("keydown", function (event) {
    _app.defaultOnKeydown(event);
    // mask segment related
    if (!isNaN(parseInt(event.key, 10))) {
      const vc = _app
        .getActiveLayerGroup()
        .getActiveViewLayer()
        .getViewController();
      if (!vc.isMask()) {
        return;
      }
      const number = parseInt(event.key, 10);
      const segHelper = vc.getMaskSegmentHelper();
      if (segHelper.hasSegment(number)) {
        const segment = segHelper.getSegment(number);
        if (event.ctrlKey) {
          if (event.altKey) {
            console.log("Delete segment: " + segment.label);
            // delete
            vc.deleteSegment(number, _app.addToUndoStack);
          } else {
            console.log("Show/hide segment: " + segment.label);
            // show/hide the selected segment
            if (segHelper.isHidden(number)) {
              segHelper.removeFromHidden(number);
            } else {
              segHelper.addToHidden(number);
            }
            vc.applyHiddenSegments();
          }
        }
      }
    }
  });
  // default on resize
  window.addEventListener("resize", function () {
    _app.onResize();
  });

  const options = {};
  // special dicom web request header
  if (_dicomWeb) {
    options.requestHeaders = [{
      name: "Accept",
      value: 'multipart/related; type="application/dicom"; transfer-syntax=*',
    }, ];
  }
  // load from window location
  _app.loadFromUri(window.location.href, options);
}

/**
 * Setup.
 */
function onDOMContentLoaded() {
  // setup
  viewerSetup();

  const positionInput = document.getElementById("position");
  positionInput.addEventListener("change", function () {
    const vls = _app.getViewLayersByDataId("0");
    const vc = vls[0].getViewController();
    const values = this.value.split(",");
    vc.setCurrentPosition(
      new dwv.Point([
        parseFloat(values[0]),
        parseFloat(values[1]),
        parseFloat(values[2]),
      ])
    );
  });

  const resetLayoutButton = document.getElementById("resetlayout");
  resetLayoutButton.disabled = true;
  resetLayoutButton.addEventListener("click", function () {
    _app.resetLayout();
  });

  const changeLayoutSelect = document.getElementById("changelayout");
  changeLayoutSelect.disabled = true;
  changeLayoutSelect.addEventListener("change", function (event) {
    const layout = event.target.value;
    if (layout !== "one" && layout !== "side" && layout !== "mpr") {
      throw new Error("Unknown layout: " + layout);
    }
    _layout = layout;

    let configs;
    const dataIds = _app.getDataIds();
    if (layout === "one") {
      addLayerGroups(1);
      configs = getOnebyOneDataViewConfig(dataIds);
    } else if (layout === "side") {
      addLayerGroups(2);
      configs = getOnebyTwoDataViewConfig(dataIds);
    } else if (layout === "mpr") {
      addLayerGroups(3);
      configs = getMPRDataViewConfig(dataIds);
    }

    // unbind app to controls
    unbindAppToControls();

    // set config
    _app.setDataViewConfig(configs);

    clearDataTable();
    for (let i = 0; i < dataIds.length; ++i) {
      _app.render(dataIds[i]);
      // add data row (will bind controls)
      addDataRow(dataIds[i]);
    }

    // need to set tool after config change
    _app.setTool(getSelectedTool());
  });

  const smoothingChk = document.getElementById("changesmoothing");
  smoothingChk.checked = false;
  smoothingChk.disabled = true;
  smoothingChk.addEventListener("change", function (event) {
    _app.setImageSmoothing(event.target.checked);
  });

  // setup
  setupBindersCheckboxes();
  setupToolsCheckboxes();
  setupTests();
  setupAbout();

  // bind app to input files
  const fileinput = document.getElementById("fileinput");
  fileinput.addEventListener("change", function (event) {
    files = event.target.files;
    _app.loadFiles(event.target.files);
  });
}

/**
 * Append a layer div in the root 'dwv' one.
 *
 * @param {string} id The id of the layer.
 */
function addLayerGroup(id) {
  const layerDiv = document.createElement("div");
  layerDiv.id = id;
  layerDiv.className = "layerGroup";
  const root = document.getElementById("dwv");
  root.appendChild(layerDiv);
}

/**
 * Add Layer Groups.
 *
 * @param {number} number The number of layer groups.
 */
function addLayerGroups(number) {
  // clean up
  const dwvDiv = document.getElementById("dwv");
  dwvDiv.innerHTML = "";
  // add div
  for (let i = 0; i < number; ++i) {
    addLayerGroup("layerGroup" + i);
  }
}

/**
 * Get a full view for a given div id.
 *
 * @param {string} divId The div id.
 * @returns {object} The config
 */
function getViewConfig(divId) {
  const config = {
    divId: divId
  };
  if (_layout === "mpr") {
    if (divId === "layerGroup0") {
      config.orientation = "axial";
    } else if (divId === "layerGroup1") {
      config.orientation = "coronal";
    } else if (divId === "layerGroup2") {
      config.orientation = "sagittal";
    }
  }
  return config;
}

/**
 * Create 1*2 view config(s).
 *
 * @param {Array} dataIds The list of dataIds.
 * @returns {object} The view config.
 */
function getOnebyOneDataViewConfig(dataIds) {
  const configs = {};
  for (let i = 0; i < dataIds.length; ++i) {
    configs[dataIds[i]] = [getViewConfig("layerGroup0")];
  }
  return configs;
}

/**
 * Create 1*2 view config(s).
 *
 * @param {Array} dataIds The list of dataIds.
 * @returns {object} The view config.
 */
function getOnebyTwoDataViewConfig(dataIds) {
  const configs = {};
  for (let i = 0; i < dataIds.length; ++i) {
    if (i % 2 === 0) {
      configs[dataIds[i]] = [getViewConfig("layerGroup0")];
    } else {
      configs[dataIds[i]] = [getViewConfig("layerGroup1")];
    }
  }
  return configs;
}

/**
 * Get MPR view config(s).
 *
 * @param {Array} dataIds The list of dataIds.
 * @returns {object} The view config.
 */
function getMPRDataViewConfig(dataIds) {
  const configs = {};
  for (let i = 0; i < dataIds.length; ++i) {
    configs[dataIds[i]] = [
      getViewConfig("layerGroup0"),
      getViewConfig("layerGroup1"),
      getViewConfig("layerGroup2"),
    ];
  }
  return configs;
}

/**
 * Get the layer groups div ids from the data view configs.
 *
 * @param {object} dataViewConfigs The configs.
 * @returns {Array} The list of ids.
 */
function getLayerGroupDivIds(dataViewConfigs) {
  const divIds = [];
  const keys = Object.keys(dataViewConfigs);
  for (let i = 0; i < keys.length; ++i) {
    const dataViewConfig = dataViewConfigs[keys[i]];
    for (let j = 0; j < dataViewConfig.length; ++j) {
      const divId = dataViewConfig[j].divId;
      if (!divIds.includes(divId)) {
        divIds.push(divId);
      }
    }
  }
  return divIds;
}

/**
 * Get the layer group div ids associated to a view config.
 *
 * @param {Array} dataViewConfig The data view config.
 * @returns {Array} The list of div ids.
 */
function getDivIds(dataViewConfig) {
  const divIds = [];
  for (let j = 0; j < dataViewConfig.length; ++j) {
    divIds.push(dataViewConfig[j].divId);
  }
  return divIds;
}

/**
 * Get the layer group div ids associated to a data id.
 *
 * @param {string} dataId The data id.
 * @returns {Array} The list of div ids.
 */
function getDataLayerGroupDivIds(dataId) {
  const dataViewConfigs = _app.getDataViewConfig();
  let viewConfig = dataViewConfigs[dataId];
  if (typeof viewConfig === "undefined") {
    viewConfig = dataViewConfigs["*"];
  }
  return getDivIds(viewConfig);
}

/**
 * Setup the binders checkboxes
 */
function setupBindersCheckboxes() {
  const bindersDiv = document.getElementById("binders");
  const propList = ["Contraste", "Position", "Zoom", "Offset", "Opacidad"];
  const binders = [];
  // add all binders at startup
  for (let b = 0; b < propList.length; ++b) {
    binders.push(propList[b] + "Binder");
  }
  _app.setLayerGroupsBinders(binders);

  /**
   * Add a binder.
   *
   * @param {string} propName The name of the property to bind.
   */
  function addBinder(propName) {
    binders.push(propName + "Binder");
    _app.setLayerGroupsBinders(binders);
  }
  /**
   * Remove a binder.
   *
   * @param {string} propName The name of the property to bind.
   */
  function removeBinder(propName) {
    const index = binders.indexOf(propName + "Binder");
    if (index !== -1) {
      binders.splice(index, 1);
    }
    _app.setLayerGroupsBinders(binders);
  }
  /**
   * Get the input change handler for a binder.
   *
   * @param {string} propName The name of the property to bind.
   * @returns {object} The handler.
   */
  function getOnInputChange(propName) {
    return function (event) {
      if (event.target.checked) {
        addBinder(propName);
      } else {
        removeBinder(propName);
      }
    };
  }
  // individual binders
  for (let i = 0; i < propList.length; ++i) {
    const propName = propList[i];

    const input = document.createElement("input");
    input.id = "binder-" + i;
    input.type = "checkbox";
    input.checked = true;
    input.onchange = getOnInputChange(propName);

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.appendChild(document.createTextNode(propName));

    bindersDiv.appendChild(input);
    bindersDiv.appendChild(label);
  }

  // check all
  const allInput = document.createElement("input");
  allInput.id = "binder-all";
  allInput.type = "checkbox";
  allInput.checked = true;
  allInput.onchange = function () {
    for (let j = 0; j < propList.length; ++j) {
      document.getElementById("binder-" + j).click();
    }
  };
  const allLabel = document.createElement("label");
  allLabel.htmlFor = allInput.id;
  allLabel.appendChild(document.createTextNode("all"));
  bindersDiv.appendChild(allInput);
  bindersDiv.appendChild(allLabel);
}

/**
 * Setup the tools checkboxes
 */
function setupToolsCheckboxes() {
  const toolsDiv = document.getElementById("tools");
  const keys = Object.keys(_tools);

  const getChangeTool = function (tool) {
    return function () {
      _app.setTool(tool);
      if (tool === "Draw") {
        const name = _tools.Draw.options[0];
        _app.setToolFeatures({
          shapeName: name
        });
      }
    };
  };

  const getKeyCheck = function (char, input) {
    return function (event) {
      if (
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key === char
      ) {
        input.click();
      }
    };
  };

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];

    const input = document.createElement("input");
    input.id = "tool-" + i;
    input.name = "tools";
    input.type = "radio";
    input.onchange = getChangeTool(key);

    if (key === "Desplazar") {
      input.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.appendChild(document.createTextNode(key));

    toolsDiv.appendChild(input);
    toolsDiv.appendChild(label);

    // keyboard shortcut
    window.addEventListener(
      "keydown",
      getKeyCheck(key[0].toLowerCase(), input)
    );
  }
}

/**
 * Get the selected tool
 *
 * @returns {string} The tool name.
 */
function getSelectedTool() {
  const toolsInput = document.getElementsByName("tools");
  let toolIndex = null;
  for (let j = 0; j < toolsInput.length; ++j) {
    if (toolsInput[j].checked) {
      toolIndex = j;
      break;
    }
  }
  return Object.keys(_tools)[toolIndex];
}

/**
 * Bind app to controls.
 */
function bindAppToControls() {
  _app.addEventListener("wlchange", onWLChange);
  _app.addEventListener("opacitychange", onOpacityChange);
}

/**
 * Unbind app to controls.
 */
function unbindAppToControls() {
  _app.removeEventListener("wlchange", onWLChange);
  _app.removeEventListener("opacitychange", onOpacityChange);
}

/**
 * Handle app wl change.
 *
 * @param {object} event The change event.
 */
function onWLChange(event) {
  // width number
  let elemId = "width-" + event.dataid + "-number";
  let elem = document.getElementById(elemId);
  if (elem) {
    elem.value = event.value[1];
  } else {
    console.warn("wl change: HTML not ready?");
  }
  // width range
  elemId = "width-" + event.dataid + "-range";
  elem = document.getElementById(elemId);
  if (elem) {
    elem.value = event.value[1];
  }
  // center number
  elemId = "center-" + event.dataid + "-number";
  elem = document.getElementById(elemId);
  if (elem) {
    elem.value = event.value[0];
  }
  // center range
  elemId = "center-" + event.dataid + "-range";
  elem = document.getElementById(elemId);
  if (elem) {
    elem.value = event.value[0];
  }
  // preset select
  elemId = "preset-" + event.dataid + "-select";
  elem = document.getElementById(elemId);
  if (elem) {
    const ids = getDataLayerGroupDivIds(event.dataid);
    const lg = _app.getLayerGroupByDivId(ids[0]);
    const vls = lg.getViewLayersByDataId(event.dataid);
    if (typeof vls !== "undefined" && vls.length !== 0) {
      const vl = vls[0];
      const vc = vl.getViewController();
      const presetName = vc.getCurrentWindowPresetName();
      const optName = "manual";
      if (presetName === optName) {
        const options = elem.options;
        const optId = "preset-manual";
        let manualOpt = options.namedItem(optId);
        if (!manualOpt) {
          const opt = document.createElement("option");
          opt.id = optId;
          opt.value = optName;
          opt.appendChild(document.createTextNode(optName));
          manualOpt = elem.appendChild(opt);
        }
        elem.selectedIndex = manualOpt.index;
      }
    }
  }
}

/**
 * Handle app opacity change.
 *
 * @param {object} event The change event.
 */
function onOpacityChange(event) {
  const value = parseFloat(event.value[0]).toPrecision(3);
  // number
  let elemId = "opacity-" + event.dataid + "-number";
  let elem = document.getElementById(elemId);
  if (elem) {
    elem.value = value;
  } else {
    console.warn("opacity change: HTML not ready?");
  }
  // range
  elemId = "opacity-" + event.dataid + "-range";
  elem = document.getElementById(elemId);
  if (elem) {
    elem.value = value;
  }
}

/**
 * Clear the data table.
 */
function clearDataTable() {
  const detailsDiv = document.getElementById("layersdetails");
  detailsDiv.innerHTML = "";
}

/**
 * Get a control div: label, range and number field.
 *
 * @param {string} id The control id.
 * @param {string} name The control name.
 * @param {number} min The control minimum value.
 * @param {number} max The control maximum value.
 * @param {number} value The control value.
 * @param {Function} callback The callback on control value change.
 * @param {number} precision Optional number field float precision.
 * @returns {object} The control div.
 */
function getControlDiv(id, name, min, max, value, callback, precision) {
  const range = document.createElement("input");
  range.id = id + "-range";
  range.className = "ctrl-range";
  range.type = "range";
  range.min = min.toPrecision(precision);
  range.max = max.toPrecision(precision);
  range.step = ((max - min) * 0.01).toPrecision(precision);
  range.value = value;

  const label = document.createElement("label");
  label.id = id + "-label";
  label.className = "ctrl-label";
  label.htmlFor = range.id;
  label.appendChild(document.createTextNode(name));

  const number = document.createElement("input");
  number.id = id + "-number";
  number.className = "ctrl-number";
  number.type = "number";
  number.min = range.min;
  number.max = range.max;
  number.step = range.step;
  number.value = parseFloat(value).toPrecision(precision);

  // callback and bind range and number
  number.oninput = function () {
    range.value = this.value;
    callback(this.value);
  };
  range.oninput = function () {
    number.value = parseFloat(this.value).toPrecision(precision);
    callback(this.value);
  };

  const div = document.createElement("div");
  div.id = id + "-ctrl";
  div.className = "ctrl";
  div.appendChild(label);
  div.appendChild(range);
  div.appendChild(number);

  return div;
}

/**
 * Add a data row.
 *
 * @param {string} dataId The data id.
 */
function addDataRow(dataId) {
  // bind app to controls on first id
  if (dataId === "0") {
    bindAppToControls();
  }

  const dataViewConfigs = _app.getDataViewConfig();
  const allLayerGroupDivIds = getLayerGroupDivIds(dataViewConfigs);
  // use first view layer
  const initialVls = _app.getViewLayersByDataId(dataId);
  const initialVl = initialVls[0];
  const initialVc = initialVl.getViewController();
  const initialWl = initialVc.getWindowLevel();

  let table = document.getElementById("layerstable");
  let body;
  // create table if not present
  if (!table) {
    table = document.createElement("table");
    table.id = "layerstable";
    const header = table.createTHead();
    const trow = header.insertRow(0);
    const insertTCell = function (text) {
      const th = document.createElement("th");
      th.innerHTML = text;
      trow.appendChild(th);
    };
    insertTCell("Id");
    for (let j = 0; j < allLayerGroupDivIds.length; ++j) {
      insertTCell("LG" + j);
    }
    insertTCell("Contrast");
    insertTCell("Preset");
    body = table.createTBody();
    const div = document.getElementById("layersdetails");
    div.appendChild(table);
  } else {
    body = table.getElementsByTagName("tbody")[0];
  }

  // add new layer row
  const row = body.insertRow();
  let cell;

  // get the selected layer group ids
  const getSelectedLayerGroupIds = function () {
    const res = [];
    for (let l = 0; l < allLayerGroupDivIds.length; ++l) {
      const layerGroupDivId = allLayerGroupDivIds[l];
      const elemId = "layerselect-" + layerGroupDivId + "-" + dataId;
      const elem = document.getElementById(elemId);
      if (elem && elem.checked) {
        res.push(layerGroupDivId);
      }
    }
    return res;
  };

  // get a layer radio button
  const getLayerRadio = function (index, divId) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "layerselect-" + index;
    radio.id = "layerselect-" + divId + "-" + dataId;
    radio.checked = true;
    radio.onchange = function (event) {
      const fullId = event.target.id;
      const split = fullId.split("-");
      const groupDivId = split[1];
      const dataId = split[2];
      const lg = _app.getLayerGroupByDivId(groupDivId);
      lg.setActiveDrawLayerByDataId(dataId);
      lg.setActiveViewLayerByDataId(dataId);
    };
    return radio;
  };

  // get a layer add button
  const getLayerAdd = function (index, divId) {
    const button = document.createElement("button");
    button.name = "layeradd-" + index;
    button.id = "layeradd-" + divId + "-" + dataId;
    button.title = "Add layer";
    button.appendChild(document.createTextNode("+"));
    button.onclick = function () {
      // update app
      _app.addDataViewConfig(dataId, getViewConfig(divId));
      // update html
      const parent = button.parentElement;
      parent.replaceChildren();
      parent.appendChild(getLayerRadio(index, divId));
      parent.appendChild(getLayerRem(index, divId));
      parent.appendChild(getLayerUpdate(index, divId, "axial"));
      parent.appendChild(getLayerUpdate(index, divId, "coronal"));
      parent.appendChild(getLayerUpdate(index, divId, "sagittal"));
    };
    return button;
  };

  // get a layer remove button
  const getLayerRem = function (index, divId) {
    const button = document.createElement("button");
    button.name = "layerrem-" + index;
    button.id = "layerrem-" + divId + "-" + dataId;
    button.title = "Remove layer";
    button.appendChild(document.createTextNode("-"));
    button.onclick = function () {
      // update app
      _app.removeDataViewConfig(dataId, getViewConfig(divId));
      // update html
      const parent = button.parentElement;
      parent.replaceChildren();
      parent.appendChild(getLayerAdd(index, divId));
    };
    return button;
  };

  // get a layer update button
  const getLayerUpdate = function (index, divId, orientation) {
    const button = document.createElement("button");
    const letter = orientation[0].toUpperCase();
    button.name = "layerupd-" + index + "_" + letter;
    button.id = "layerupd-" + divId + "-" + dataId + "_" + letter;
    button.title = "Change layer orientation to " + orientation;
    button.appendChild(document.createTextNode(letter));
    button.onclick = function () {
      // update app
      const config = getViewConfig(divId);
      config.orientation = orientation;
      _app.updateDataViewConfig(dataId, divId, config);
    };
    return button;
  };

  // cell: id
  cell = row.insertCell();
  cell.appendChild(document.createTextNode(dataId));

  // cell: radio
  let viewConfig = dataViewConfigs[dataId];
  if (typeof viewConfig === "undefined") {
    viewConfig = dataViewConfigs["*"];
  }
  const dataLayerGroupsIds = getDivIds(viewConfig);
  for (let l = 0; l < allLayerGroupDivIds.length; ++l) {
    const layerGroupDivId = allLayerGroupDivIds[l];
    cell = row.insertCell();
    if (dataLayerGroupsIds.includes(layerGroupDivId)) {
      cell.appendChild(getLayerRadio(l, layerGroupDivId));
      cell.appendChild(getLayerRem(l, layerGroupDivId));
      cell.appendChild(getLayerUpdate(l, layerGroupDivId, "axial"));
      cell.appendChild(getLayerUpdate(l, layerGroupDivId, "coronal"));
      cell.appendChild(getLayerUpdate(l, layerGroupDivId, "sagittal"));
    } else {
      cell.appendChild(getLayerAdd(l, layerGroupDivId));
    }
  }

  const image = _app.getImage(initialVl.getDataId());
  const dataRange = image.getDataRange();
  const rescaledDataRange = image.getRescaledDataRange();
  const floatPrecision = 4;

  // cell: contrast
  cell = row.insertCell();
  const widthId = "width-" + dataId;
  const centerId = "center-" + dataId;
  // callback
  const changeContrast = function () {
    const width = parseFloat(
      document.getElementById(widthId + "-number").value
    );
    const center = parseFloat(
      document.getElementById(centerId + "-number").value
    );
    // update selected layers
    const lgIds = getSelectedLayerGroupIds();
    for (let i = 0; i < lgIds.length; ++i) {
      const lg = _app.getLayerGroupByDivId(lgIds[i]);
      const vc = lg.getActiveViewLayer().getViewController();
      vc.setWindowLevel(center, width);
    }
  };
  // add controls
  cell.appendChild(
    getControlDiv(
      widthId,
      "width",
      0,
      rescaledDataRange.max - rescaledDataRange.min,
      initialWl.width,
      changeContrast,
      floatPrecision
    )
  );
  cell.appendChild(
    getControlDiv(
      centerId,
      "center",
      rescaledDataRange.min,
      rescaledDataRange.max,
      initialWl.center,
      changeContrast,
      floatPrecision
    )
  );

  // cell: presets
  cell = row.insertCell();
  // callback
  const changePreset = function (event) {
    // update selected layers
    const lgIds = getSelectedLayerGroupIds();
    for (let i = 0; i < lgIds.length; ++i) {
      const lg = _app.getLayerGroupByDivId(lgIds[i]);
      const vc = lg.getActiveViewLayer().getViewController();
      vc.setWindowLevelPreset(event.target.value);
    }
  };
  const select = document.createElement("select");
  select.id = "preset-" + dataId + "-select";
  const presets = initialVc.getWindowLevelPresetsNames();
  for (const preset of presets) {
    const option = document.createElement("option");
    option.value = preset;
    option.appendChild(document.createTextNode(preset));
    select.appendChild(option);
  }
  select.onchange = changePreset;
  cell.appendChild(select);
}

/**
 * Compare two pos pat keys.
 *
 * @param {string} a The key of the first item.
 * @param {string} b The key of the second item.
 * @returns {number} Negative if a<b, positive if a>b.
 */
function comparePosPat(a, b) {
  const za = parseFloat(a.split("\\").at(-1));
  const zb = parseFloat(b.split("\\").at(-1));
  return za - zb;
}

/**
 * Sort an object with pos pat string keys.
 *
 * @param {object} obj The object to sort
 * @returns {object} The sorted object.
 */
function sortByPosPatKey(obj) {
  const keys = Object.keys(obj);
  keys.sort(comparePosPat);
  const sorted = new Map();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    sorted.set(key, obj[key]);
  }
  return sorted;
}

/**
 * Get a rounding function for a specific precision.
 *
 * @param {number} precision The rounding precision.
 * @returns {Function} The rounding function.
 */
function getPrecisionRound(precision) {
  return function (x) {
    return dwv.precisionRound(x, precision);
  };
}

/**
 * Log the DICCOM seg segments ordered by frame position patients.
 *
 * @param {object} elements The DICOM seg elements.
 */
function logFramePosPats(elements) {
  // PerFrameFunctionalGroupsSequence
  const perFrame = elements["52009230"].value;
  const perPos = {};
  for (let i = 0; i < perFrame.length; ++i) {
    // PlanePositionSequence
    const posSq = perFrame[i]["00209113"].value;
    // ImagePositionPatient
    const pos = posSq[0]["00200032"].value;
    if (typeof perPos[pos] === "undefined") {
      perPos[pos] = [];
    }
    // FrameContentSequence
    const frameSq = perFrame[i]["00209111"].value;
    // DimensionIndexValues
    const dim = frameSq[0]["00209157"].value;
    perPos[pos].push(dim);
  }
  console.log("DICOM SEG Segments", sortByPosPatKey(perPos));
}

/**
 * Get the meta data with names instead of tag keys.
 *
 * @param {object} metaData The initial meta data.
 * @returns {object} The list of meta data.
 */
function getMetaDataWithNames(metaData) {
  let meta = metaData;
  if (typeof meta["00020010"] !== "undefined") {
    // replace tag key with tag name for dicom
    meta = Object.keys(meta).reduce((accumulator, currentValue) => {
      const tag = dwv.getTagFromKey(currentValue);
      let key = tag.getNameFromDictionary();
      if (typeof key === "undefined") {
        // add 'x' to help sorting
        key = "x" + tag.getKey();
      }
      accumulator[key] = meta[currentValue];
      return accumulator;
    }, {});
  }
  return meta;
}

/**
 * Setup test line.
 */
function setupTests() {
  const renderTestButton = document.createElement("button");
  renderTestButton.onclick = runRenderTest;
  renderTestButton.appendChild(document.createTextNode("render test"));

  const testsDiv = document.getElementById("tests");
  testsDiv.appendChild(renderTestButton);
}

/**
 * Get simple stats for an array.
 *
 * @param {Array} array Input array.
 * @returns {object} min, max, mean and standard deviation.
 */
function getSimpleStats(array) {
  let min = array[0];
  let max = min;
  let sum = 0;
  let sumSqr = 0;
  let val = 0;
  const length = array.length;
  for (let i = 0; i < length; ++i) {
    val = array[i];
    if (val < min) {
      min = val;
    } else if (val > max) {
      max = val;
    }
    sum += val;
    sumSqr += val * val;
  }

  const mean = sum / length;
  // see http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
  const variance = sumSqr / length - mean * mean;
  const stdDev = Math.sqrt(variance);

  return {
    min: min,
    max: max,
    mean: mean,
    stdDev: stdDev,
  };
}

/**
 * Run render tests.
 */
function runRenderTest() {
  const numberOfRun = 20;

  const vl = _app.getActiveLayerGroup().getActiveViewLayer();
  const vc = vl.getViewController();
  const runner = function () {
    vc.incrementIndex(2);
  };

  let startTime;
  const timings = [];
  const onRenderStart = function ( /*event*/ ) {
    startTime = performance.now();
  };
  const onRenderEnd = function ( /*event*/ ) {
    const endTime = performance.now();
    timings.push(endTime - startTime);
    startTime = undefined;

    if (timings.length < numberOfRun) {
      setTimeout(() => {
        runner();
      }, 100);
    } else {
      console.log("Stats:", getSimpleStats(timings));
      // clean up
      _app.removeEventListener("renderstart", onRenderStart);
      _app.removeEventListener("renderend", onRenderEnd);
    }
  };

  // setup
  _app.addEventListener("renderstart", onRenderStart);
  _app.addEventListener("renderend", onRenderEnd);

  // start
  runner();
}

/**
 * Setup about line.
 */
function setupAbout() {
  const testsDiv = document.getElementById("about");
  const link = document.createElement("a");
  link.href = "https://github.com/ivmartel/dwv";
  link.appendChild(document.createTextNode("dwv"));
  const text = document.createTextNode(
    " v" + dwv.getDwvVersion() + " on " + navigator.userAgent
  );

  testsDiv.appendChild(link);
  testsDiv.appendChild(text);
}