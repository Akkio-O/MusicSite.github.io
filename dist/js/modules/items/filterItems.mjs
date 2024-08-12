import*as t from"./items.mjs";const e=document.querySelector("#category_menu__profiles__CategoryText"),o=document.querySelector("#category_menu__profiles__SubCategoryText"),n=document.querySelector("#category_menu__profiles__subSubCategoryText");let r=t.selectedCategory,c=t.selectedSubcategory,s=t.selectedSubSubcategory;const a=document.getElementById("sort-asc"),l=document.getElementById("sort-desc");function i(t,r,c){const s=document.querySelector("#subSubCategoryDropdown"),a=s.querySelectorAll("a").length;s.classList.toggle("show");const l=new Set(t.filter((t=>t.IC_GROUP0.trim()===r)).filter((t=>t.IC_GROUP1.trim()===c)).map((t=>t.IC_GROUP2)));a!==l.size&&(s.innerHTML="",l.forEach(((r,c)=>{if(r&&""!==r.trim()){const a=document.createElement("a");a.textContent=r,s.appendChild(a),a.addEventListener("click",(function(r){n.textContent=r.target.textContent;const c=e.textContent,a=o.textContent,l=r.target.textContent;i(t,c,a),s.classList.remove("show"),history.pushState(null,null,`/category/products?category=${encodeURIComponent(c)}&subcategory=${encodeURIComponent(a)}&subsubcategory=${encodeURIComponent(l)}`)})),a.dataset.subSubcategory=c}})))}function u(t,n){const r=document.querySelector("#subCategoryDropdown");r.classList.toggle("show"),document.querySelector("#categoryDropdown").classList.remove("show"),document.querySelector("#subSubCategoryDropdown").classList.remove("show");const s=r.querySelectorAll("a").length,a=new Set(t.filter((t=>t.IC_GROUP0&&t.IC_GROUP1&&t.IC_GROUP0.trim()===n)).map((t=>t.IC_GROUP1.trim())));!n&&c&&a.size>0&&(n=t.find((t=>t.IC_GROUP1.trim()===c)).IC_GROUP0.trim(),e.textContent=n),s!==a.size&&(r.innerHTML="",a.forEach(((n,c)=>{if(n&&""!==n.trim()){const s=document.createElement("a");s.textContent=n,r.appendChild(s),s.addEventListener("click",(function(n){o.textContent=n.target.textContent;const c=e.textContent,s=n.target.textContent;i(t,c,s),r.classList.remove("show"),history.pushState(null,null,`/category/products?category=${encodeURIComponent(c)}&subcategory=${encodeURIComponent(s)}`)})),s.dataset.subcategory=c}})))}function C(t,o){const n=new Set(t.map((t=>t.IC_GROUP0))),r=document.querySelector("#categoryDropdown");r.classList.toggle("show"),document.querySelector("#subCategoryDropdown").classList.remove("show"),document.querySelector("#subSubCategoryDropdown").classList.remove("show");r.querySelectorAll("a").length!==n.size&&(r.innerHTML="",n.forEach(((n,c)=>{if("string"==typeof n&&""!==n.trim()){const s=document.createElement("a");s.textContent=n,r.appendChild(s),s.addEventListener("click",(function(n){const c=n.target.textContent||o;e.textContent=c,console.log(c),u(t,c),r.classList.remove("show"),history.pushState(null,null,`/category/products?category=${encodeURIComponent(c)}`)})),s.dataset.category=c}})))}function d(e){t.itemsBlock.querySelectorAll(".col-auto").forEach((t=>t.remove())),t.setupPagination(e),t.renderPage(1,e)}function _(t){a.addEventListener("click",(function(e){t.sort(((t,e)=>t.CV_PRICE_13-e.CV_PRICE_13)),d(t)})),l.addEventListener("click",(function(e){t.sort(((t,e)=>e.CV_PRICE_13-t.CV_PRICE_13)),d(t)}))}async function g(t){const e=await fetch(t);if(!e.ok)throw new Error("Ошибка HTTP: "+e.status);return e.json()}function m(t){e.addEventListener("click",(function(){C(t),document.querySelector("#categoryDropdown").classList.toggle("show")}))}function y(t,e,o,n,r,c){let s=t;if(null!==r&&""!==r)s=t.filter((t=>t.IE_NAME.toLowerCase().includes(r.toLowerCase())));else if(c){const e=t.find((t=>t.IE_NAME.toLowerCase().includes(c.toLowerCase())));e&&s.unshift(e)}return s=s.filter((t=>{const r=!e||t.IC_GROUP0===e,c=!o||t.IC_GROUP1===o,s=!n||t.IC_GROUP2===n;return r&&c&&s})),s}function f(e,o){const n=e.target.dataset;s=n.subSubcategory,c=n.subcategory,r=n.category,(r||c||s)&&fetch("http://localhost:8080/categoryGroupFilter").then((t=>{if(!t.ok)throw new Error("Ошибка HTTP: "+t.status);return t.json()})).then((e=>{const o=t.filterItems(r,c,s,e);_(o),d(o)}))}function P(e){window.addEventListener("click",(function(o){const n=o.target,r=document.querySelectorAll(".btn_filter");if(Array.from(r).some((t=>t.contains(n)))&&(r.forEach((t=>t.classList.remove("active"))),n.classList.add("active")),n.classList.contains("btn_filter")){const o=n.getAttribute("data-default"),r=n.getAttribute("data-new"),c=n.getAttribute("data-discount");n.getAttribute("data-newTime");if(null!==o)t.itemsBlock.querySelectorAll(".col-auto").forEach((t=>t.remove())),t.setupPagination(e),t.renderPage(1,e);else if(null!==r){const o=e.sort(((t,e)=>new Date(e.created_at)-new Date(t.created_at)));t.itemsBlock.querySelectorAll(".col-auto").forEach((t=>t.remove())),t.setupPagination(o),t.renderPage(1,o)}else if(null!==c){const o=e.filter((t=>t.CV_PRICE_13&&t.CV_PRICE_18&&0!==t.CV_PRICE_18&&0!==t.CP_QUANTITY&&"Продукт снят с производства"!==t.IP_PROP140)).filter((t=>100-100*t.CV_PRICE_13/t.CV_PRICE_18>0)).sort(((t,e)=>(t.CV_PRICE_13-t.CV_PRICE_18)/t.CV_PRICE_13-(e.CV_PRICE_13-e.CV_PRICE_18)/e.CV_PRICE_13)).concat(e.filter((t=>t.CV_PRICE_13&&t.CV_PRICE_18&&0!==t.CV_PRICE_18&&0===t.CP_QUANTITY&&"Продукт снят с производства"!==t.IP_PROP140)));t.itemsBlock.querySelectorAll(".col-auto").forEach((t=>t.remove())),t.setupPagination(o),t.renderPage(1,o)}}}))}export{g as loadData,m as showCategories,y as filterData,d as updateItemsDisplay,_ as addSortEventListeners,f as handleCategoryClicks,i as dropdownItemCategory,u as dropdownSubCategory,C as dropdownCategory,P as addFilterEventListeners};