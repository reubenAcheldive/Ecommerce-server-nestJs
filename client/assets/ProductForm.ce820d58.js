import{l as p,u as d,c as h,j as e,d as l,m as n,S as v,V as b,W as g}from"./index.cb0fdbf1.js";import{L as r}from"./Label.33df78c2.js";const u={categoryRef:"",description:" ",imgUrl:"",name:"",price:0,quantity:0,_id:""},_=({editProduct:i,closeModal:c})=>{const{register:a,formState:f,handleSubmit:m}=p({defaultValues:i||u}),{Categories:t}=d(s=>s.categories),o=h();return e("div",{className:"w-96 h-full",children:l("form",{onSubmit:m(s=>{o((i==null?void 0:i._id)&&(i==null?void 0:i._id.length)>0?b({...s,_id:i==null?void 0:i._id}):g({...s})),c(!1)}),children:[l("div",{className:"flex flex-col gap-4",children:[l("div",{children:[e("div",{className:"mb-2 block",children:e(r,{value:"Name"})}),e(n,{...a("name"),type:"text",sizing:"md"})]}),l("div",{id:"select",children:[e("div",{className:"mb-2 block",children:e(r,{htmlFor:"categories",value:"Select your Category"})}),e(v,{...a("categoryRef"),id:"categories",required:!0,children:t.map((s,x)=>e("option",{value:s._id,children:s.nameCategory},s._id))})]}),l("div",{children:[e("div",{className:"mb-2 block",children:e(r,{value:"Description"})}),e(n,{...a("description"),type:"text",sizing:"md"})]}),l("div",{children:[e("div",{className:"mb-2 block",children:e(r,{value:"Picture Url"})}),e(n,{...a("imgUrl"),type:"text",sizing:"md"})]}),l("div",{children:[e("div",{className:"mb-2 block",children:e(r,{value:"Price"})}),e(n,{...a("price"),type:"text",sizing:"md"})]})]}),e("button",{type:"submit",children:i?"Edit":"Create"})]})})};export{_ as P};