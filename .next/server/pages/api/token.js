"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/token";
exports.ids = ["pages/api/token"];
exports.modules = {

/***/ "(api)/./pages/api/token.js":
/*!****************************!*\
  !*** ./pages/api/token.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/*\n * This is an example server-side function that generates a meeting token\n * server-side. You could replace this on your own back-end to include\n * custom user authentication, etc.\n */\nasync function handler(req, res) {\n  const {\n    roomName,\n    isOwner\n  } = req.body;\n\n  if (req.method === 'POST' && roomName) {\n    console.log(`Getting token for room '${roomName}' as owner: ${isOwner}`);\n    const options = {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        Authorization: `Bearer ${process.env.DAILY_API_KEY}`\n      },\n      body: JSON.stringify({\n        properties: {\n          room_name: roomName,\n          is_owner: isOwner\n        }\n      })\n    };\n    const dailyRes = await fetch(`${process.env.DAILY_REST_DOMAIN || 'https://api.daily.co/v1'}/meeting-tokens`, options);\n    const {\n      token,\n      error\n    } = await dailyRes.json();\n\n    if (error) {\n      return res.status(500).json({\n        error\n      });\n    }\n\n    return res.status(200).json({\n      token,\n      domain: process.env.DAILY_DOMAIN\n    });\n  }\n\n  return res.status(500);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdG9rZW4uanMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxlQUFlQSxPQUFmLENBQXVCQyxHQUF2QixFQUE0QkMsR0FBNUIsRUFBaUM7QUFDOUMsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBO0FBQVosTUFBd0JILEdBQUcsQ0FBQ0ksSUFBbEM7O0FBRUEsTUFBSUosR0FBRyxDQUFDSyxNQUFKLEtBQWUsTUFBZixJQUF5QkgsUUFBN0IsRUFBdUM7QUFDckNJLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLDJCQUEwQkwsUUFBUyxlQUFjQyxPQUFRLEVBQXRFO0FBRUEsVUFBTUssT0FBTyxHQUFHO0FBQ2RILE1BQUFBLE1BQU0sRUFBRSxNQURNO0FBRWRJLE1BQUFBLE9BQU8sRUFBRTtBQUNQLHdCQUFnQixrQkFEVDtBQUVQQyxRQUFBQSxhQUFhLEVBQUcsVUFBU0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGFBQWM7QUFGNUMsT0FGSztBQU1kVCxNQUFBQSxJQUFJLEVBQUVVLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQ25CQyxRQUFBQSxVQUFVLEVBQUU7QUFBRUMsVUFBQUEsU0FBUyxFQUFFZixRQUFiO0FBQXVCZ0IsVUFBQUEsUUFBUSxFQUFFZjtBQUFqQztBQURPLE9BQWY7QUFOUSxLQUFoQjtBQVdBLFVBQU1nQixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUN6QixHQUNDVCxPQUFPLENBQUNDLEdBQVIsQ0FBWVMsaUJBQVosSUFBaUMseUJBQ2xDLGlCQUh5QixFQUkxQmIsT0FKMEIsQ0FBNUI7QUFPQSxVQUFNO0FBQUVjLE1BQUFBLEtBQUY7QUFBU0MsTUFBQUE7QUFBVCxRQUFtQixNQUFNSixRQUFRLENBQUNLLElBQVQsRUFBL0I7O0FBRUEsUUFBSUQsS0FBSixFQUFXO0FBQ1QsYUFBT3RCLEdBQUcsQ0FBQ3dCLE1BQUosQ0FBVyxHQUFYLEVBQWdCRCxJQUFoQixDQUFxQjtBQUFFRCxRQUFBQTtBQUFGLE9BQXJCLENBQVA7QUFDRDs7QUFFRCxXQUFPdEIsR0FBRyxDQUFDd0IsTUFBSixDQUFXLEdBQVgsRUFBZ0JELElBQWhCLENBQXFCO0FBQUVGLE1BQUFBLEtBQUY7QUFBU0ksTUFBQUEsTUFBTSxFQUFFZixPQUFPLENBQUNDLEdBQVIsQ0FBWWU7QUFBN0IsS0FBckIsQ0FBUDtBQUNEOztBQUVELFNBQU8xQixHQUFHLENBQUN3QixNQUFKLENBQVcsR0FBWCxDQUFQO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3VzdG9tL2JyZWFrb3V0LXJvb21zLy4vcGFnZXMvYXBpL3Rva2VuLmpzPzdjZTAiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFRoaXMgaXMgYW4gZXhhbXBsZSBzZXJ2ZXItc2lkZSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBhIG1lZXRpbmcgdG9rZW5cbiAqIHNlcnZlci1zaWRlLiBZb3UgY291bGQgcmVwbGFjZSB0aGlzIG9uIHlvdXIgb3duIGJhY2stZW5kIHRvIGluY2x1ZGVcbiAqIGN1c3RvbSB1c2VyIGF1dGhlbnRpY2F0aW9uLCBldGMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgY29uc3QgeyByb29tTmFtZSwgaXNPd25lciB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiByb29tTmFtZSkge1xuICAgIGNvbnNvbGUubG9nKGBHZXR0aW5nIHRva2VuIGZvciByb29tICcke3Jvb21OYW1lfScgYXMgb3duZXI6ICR7aXNPd25lcn1gKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Byb2Nlc3MuZW52LkRBSUxZX0FQSV9LRVl9YCxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHByb3BlcnRpZXM6IHsgcm9vbV9uYW1lOiByb29tTmFtZSwgaXNfb3duZXI6IGlzT3duZXIgfSxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICBjb25zdCBkYWlseVJlcyA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7XG4gICAgICAgIHByb2Nlc3MuZW52LkRBSUxZX1JFU1RfRE9NQUlOIHx8ICdodHRwczovL2FwaS5kYWlseS5jby92MSdcbiAgICAgIH0vbWVldGluZy10b2tlbnNgLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBjb25zdCB7IHRva2VuLCBlcnJvciB9ID0gYXdhaXQgZGFpbHlSZXMuanNvbigpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvciB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyB0b2tlbiwgZG9tYWluOiBwcm9jZXNzLmVudi5EQUlMWV9ET01BSU4gfSk7XG4gIH1cblxuICByZXR1cm4gcmVzLnN0YXR1cyg1MDApO1xufVxuIl0sIm5hbWVzIjpbImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJyb29tTmFtZSIsImlzT3duZXIiLCJib2R5IiwibWV0aG9kIiwiY29uc29sZSIsImxvZyIsIm9wdGlvbnMiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsInByb2Nlc3MiLCJlbnYiLCJEQUlMWV9BUElfS0VZIiwiSlNPTiIsInN0cmluZ2lmeSIsInByb3BlcnRpZXMiLCJyb29tX25hbWUiLCJpc19vd25lciIsImRhaWx5UmVzIiwiZmV0Y2giLCJEQUlMWV9SRVNUX0RPTUFJTiIsInRva2VuIiwiZXJyb3IiLCJqc29uIiwic3RhdHVzIiwiZG9tYWluIiwiREFJTFlfRE9NQUlOIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/token.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/token.js"));
module.exports = __webpack_exports__;

})();