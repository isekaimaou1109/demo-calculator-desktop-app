"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function DashboardContent(props) {
  var fileSize = function fileSize(size) {
    if (size === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  var _onDragOver = function onDragOver(e) {
    e.preventDefault();
  };

  var _onDragEnter = function onDragEnter(e) {
    e.preventDefault();
  };

  var _onDragLeave = function onDragLeave(e) {
    e.preventDefault();
  };

  function scanFiles(item) {
    //let elem = document.createElement("li");
    //elem.textContent = item.name;
    //container.appendChild(elem);
    if (item.isFile) {
      console.log('file is ' + item.fullPath);
    }

    if (item.isDirectory) {
      var directoryReader = item.createReader();
      console.log('Directory name is ' + item.name); //let directoryContainer = document.createElement("ul");
      //container.appendChild(directoryContainer);

      directoryReader.readEntries(function (entries) {
        entries.forEach(function (entry) {
          scanFiles(entry);
        });
      });
    }
  }

  var _onDrop = function onDrop(e) {
    e.preventDefault();
    var items = event.dataTransfer.items;
    event.preventDefault();

    for (var i = 0; i < items.length; i++) {
      var item = items[i].webkitGetAsEntry();

      if (item) {
        scanFiles(item);
      }
    }
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dashboard_container"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "dropzone",
    onDragOver: function onDragOver(e) {
      return _onDragOver(e);
    },
    onDragEnter: function onDragEnter(e) {
      return _onDragEnter(e);
    },
    onDragLeave: function onDragLeave(e) {
      return _onDragLeave(e);
    },
    onDrop: function onDrop(e) {
      return _onDrop(e);
    }
  }));
}

;

function DashboardFilesystem(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dashboard_container"
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Hello filesystem with"));
}

;

function DashboardChatting(props) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dashboard_container"
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Hello chatting"));
}

;

function DashboardRouting() {
  var _token_ = window.location.pathname.split('/dashboard/').join('');

  return /*#__PURE__*/_react["default"].createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
    to: "/dashboard/".concat(_token_)
  }, "dashboard"), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
    to: "/dashboard/".concat(_token_, "/filesystem")
  }, "dashboard filesystem"), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Link, {
    to: "/dashboard/".concat(_token_, "/chat")
  }, "dashboard chat"), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/dashboard/:id"
  }, /*#__PURE__*/_react["default"].createElement(DashboardContent, null)), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/dashboard/:id/filesystem",
    children: /*#__PURE__*/_react["default"].createElement(DashboardFilesystem, null)
  }), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/dashboard/:id/chat",
    children: /*#__PURE__*/_react["default"].createElement(DashboardChatting, null)
  })));
}

function Dashboard(props) {
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(DashboardRouting, null));
}

if (typeof window !== "undefined") {
  _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(Dashboard, null), document.getElementById("app"));
}
