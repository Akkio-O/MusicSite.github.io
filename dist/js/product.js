const productId=document.querySelector(".product__container").getAttribute("data-XML_ID");async function loadAlternatives(e){try{const t=await fetch(`http://localhost:8080/api/alternatives/${e}`),o=await t.json();if(o.success){displayAlternatives(o.alternatives);const e=createSlider(".carousel_inner1",{axis:"horizontal",responsive:{992:{edgePadding:20,gutter:20,items:4},1400:{edgePadding:20,gutter:20,items:3}}});document.querySelector(".product__alternatives_prev").addEventListener("click",(()=>{e.goTo("prev")})),document.querySelector(".product__alternatives_next").addEventListener("click",(()=>{e.goTo("next")}))}else console.error("Ошибка при загрузке альтернативных товаров:",o.message)}catch(e){console.error("Ошибка при загрузке альтернативных товаров:",e)}}function displayAlternatives(e){const t=document.querySelector(".product__alternatives .carousel_inner1");t.innerHTML="",e.forEach((e=>{const o=document.createElement("div");o.innerHTML=`\n                <img src="${e.IE_DETAIL_PICTURE}" alt="slide">\n                <p>${e.IE_NAME}</p>\n        `,t.appendChild(o)}))}function createSlider(e,t){const o={speed:1e3,items:3,slideBy:"page",center:!0,controls:!1,autoHeight:!0,autoplayButtonOutput:!1,responsive:{1400:{edgePadding:20,gutter:20,items:3}},nav:!1,axis:"vertical",...t};return tns({container:e,...o})}loadAlternatives(productId);const slider=createSlider(".carousel_inner",{autoHeight:!1});document.querySelector(".prev").addEventListener("click",(()=>{slider.goTo("prev")})),document.querySelector(".next").addEventListener("click",(()=>{slider.goTo("next")}));const descriptionNavBlock=document.querySelector(".info__container button");function click(){descriptionNavBlock.style.dispay="none"}descriptionNavBlock.addEventListener("click",click);const idDescription=document.getElementById("idDescription"),idSpecifications=document.getElementById("idSpecifications");function switchCategory(e){const t=["Description","Specifications"];for(const o of t){const t=document.querySelector(`.${o}`),n=document.getElementById(`id${o}`);o===e?(n.classList.add("active"),t.style.display="inherit"):(n.classList.remove("active"),t.style.display="none")}}idDescription.onclick=()=>switchCategory("Description"),idSpecifications.onclick=()=>switchCategory("Specifications");const CategoryDropdown=document.querySelector("#category_menu__profiles__CategoryText"),SubCategoryDropdown=document.querySelector("#category_menu__profiles__SubCategoryText"),SubSubCategoryDropdown=document.querySelector("#category_menu__profiles__subSubCategoryText"),categoryDropdown=document.querySelector("#categoryDropdown"),subcategoryDropdown=document.querySelector("#subCategoryDropdown"),subSubcategoryDropdown=document.querySelector("#subSubCategoryDropdown");function hideDropdowns(e){e.target.closest(".dropdown-content")||(categoryDropdown.classList.remove("show"),subcategoryDropdown.classList.remove("show"),subSubcategoryDropdown.classList.remove("show"))}function dropdownItemCategory(e,t,o){const n=document.querySelector("#subSubCategoryDropdown"),r=n.querySelectorAll("a").length;n.classList.toggle("show");const c=new Set(e.filter((e=>e.IC_GROUP0.trim()===t)).filter((e=>e.IC_GROUP1.trim()===o)).map((e=>e.IC_GROUP2)));r!==c.size&&(n.innerHTML="",c.forEach(((t,o)=>{if(t&&""!==t.trim()){const r=document.createElement("a");r.href="#",r.textContent=t,n.appendChild(r),r.addEventListener("click",(function(t){SubSubCategoryDropdown.textContent=t.target.textContent;const o=CategoryDropdown.textContent,r=SubCategoryDropdown.textContent,c=t.target.textContent;dropdownItemCategory(e,o,r,c),n.classList.remove("show");const s=`/category/products?category=${encodeURIComponent(o)}&subcategory=${encodeURIComponent(r)}&subsubcategory=${encodeURIComponent(c)}`;window.open(s,"_blank")})),r.dataset.subSubcategory=o}})))}function dropdownSubCategory(e,t){const o=document.querySelector("#subCategoryDropdown");o.classList.toggle("show"),document.querySelector("#categoryDropdown").classList.remove("show"),document.querySelector("#subSubCategoryDropdown").classList.remove("show");const n=o.querySelectorAll("a").length,r=new Set(e.filter((e=>e.IC_GROUP0&&e.IC_GROUP1&&e.IC_GROUP0.trim()===t)).map((e=>e.IC_GROUP1.trim())));n!==r.size&&(o.innerHTML="",r.forEach(((t,n)=>{if(t&&""!==t.trim()){const r=document.createElement("a");r.href="#",r.textContent=t,o.appendChild(r),r.addEventListener("click",(function(t){SubCategoryDropdown.textContent=t.target.textContent;const n=CategoryDropdown.textContent,r=t.target.textContent;o.classList.remove("show"),dropdownItemCategory(e,n,r);if(e.some((e=>e.IC_GROUP0===n&&e.IC_GROUP1===r&&e.IC_GROUP2)));else{const e=`/category/products?category=${encodeURIComponent(n)}&subcategory=${encodeURIComponent(r)}`;window.open(e,"_blank")}})),r.dataset.subcategory=n}})))}document.addEventListener("click",hideDropdowns),CategoryDropdown.addEventListener("click",(function(){fetch("http://localhost:8080/getProductsData",{method:"GET"}).then((e=>{if(!e.ok)throw new Error("Network response was not ok");return e.json()})).then((e=>{const t=new Set(e.map((e=>e.IC_GROUP0))),o=document.querySelector("#categoryDropdown");o.classList.toggle("show"),document.querySelector("#subCategoryDropdown").classList.remove("show"),document.querySelector("#subSubCategoryDropdown").classList.remove("show");o.querySelectorAll("a").length!==t.size&&(o.innerHTML="",t.forEach(((t,n)=>{if("string"==typeof t&&""!==t.trim()){const r=document.createElement("a");r.href="#",r.textContent=t,o.appendChild(r),r.addEventListener("click",(function(t){CategoryDropdown.textContent=t.target.textContent;const n=t.target.textContent;dropdownSubCategory(e,n),o.classList.remove("show")})),r.dataset.category=n}})))})).catch((e=>{console.error("Произошла ошибка при получении данных:",e)}))}));