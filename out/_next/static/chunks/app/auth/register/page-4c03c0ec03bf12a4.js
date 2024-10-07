(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[454],{2584:function(e,r,t){Promise.resolve().then(t.bind(t,2893))},9376:function(e,r,t){"use strict";var a=t(5475);t.o(a,"useRouter")&&t.d(r,{useRouter:function(){return a.useRouter}})},2893:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return n}});var a=t(7437),o=t(5864),s=t(9376);function n(){let e=(0,s.useRouter)(),r=async r=>{r.preventDefault();let t=new FormData(r.target),a={username:t.get("username"),names:t.get("names"),lastnames:t.get("lastnames"),email:t.get("email"),password:t.get("password"),age:t.get("age"),phone_number:t.get("phone_number"),birthday:t.get("birthday")};try{let r=await (0,o.a$)(a);console.log("Usuario registrado:",r),e.push("/auth/login")}catch(e){console.error("Error en el registro:",e),alert("Hubo un error en el registro. Por favor prueba con otros datos.")}};return(0,a.jsx)("div",{className:"flex justify-center items-center min-h-screen bg-gray-100",children:(0,a.jsxs)("div",{className:"w-full max-w-lg bg-white p-8 rounded-lg shadow-lg",children:[(0,a.jsx)("h2",{className:"text-3xl font-bold text-center mb-6 text-gray-800",children:"Register"}),(0,a.jsxs)("form",{onSubmit:r,children:[(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"username",className:"block text-sm font-medium text-gray-700",children:"Username:"}),(0,a.jsx)("input",{type:"text",id:"username",name:"username",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"names",className:"block text-sm font-medium text-gray-700",children:"Names:"}),(0,a.jsx)("input",{type:"text",id:"names",name:"names",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"lastnames",className:"block text-sm font-medium text-gray-700",children:"Last Names:"}),(0,a.jsx)("input",{type:"text",id:"lastnames",name:"lastnames",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Email:"}),(0,a.jsx)("input",{type:"email",id:"email",name:"email",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password:"}),(0,a.jsx)("input",{type:"password",id:"password",name:"password",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"age",className:"block text-sm font-medium text-gray-700",children:"Age:"}),(0,a.jsx)("input",{type:"number",id:"age",name:"age",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"phone_number",className:"block text-sm font-medium text-gray-700",children:"Phone Number:"}),(0,a.jsx)("input",{type:"text",id:"phone_number",name:"phone_number",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsxs)("div",{className:"mb-6",children:[(0,a.jsx)("label",{htmlFor:"birthday",className:"block text-sm font-medium text-gray-700",children:"Birthday:"}),(0,a.jsx)("input",{type:"date",id:"birthday",name:"birthday",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"})]}),(0,a.jsx)("button",{type:"submit",className:"w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300",children:"Register"})]})]})})}},5864:function(e,r,t){"use strict";t.d(r,{C$:function(){return u},F:function(){return c},FQ:function(){return i},So:function(){return s},a$:function(){return o},kT:function(){return n},tq:function(){return l}});let a="http://balacner-1065788816.us-east-1.elb.amazonaws.com:8000",o=async e=>{try{let r=await fetch("".concat(a,"/register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!r.ok)throw Error("Error al registrar el usuario");return await r.json()}catch(e){throw console.error(e),e}},s=async e=>{try{let r=await fetch("".concat(a,"/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!r.ok)throw Error("Error en la autenticaci\xf3n");return await r.json()}catch(e){throw console.error(e),e}},n=async()=>{try{let e=await fetch("".concat(a,"/games")),r=await e.json();if(!e.ok)throw Error("Error al obtener los juegos");return r.games}catch(e){throw console.error(e),e}},l=async e=>{try{let r=await fetch("".concat(a,"/games/").concat(e)),t=await r.json();if(!r.ok)throw Error("Error al obtener los detalles del juego");return t.games}catch(e){throw console.error(e),e}},c=async(e,r)=>{try{let t=await fetch("".concat(a,"/assign"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:e,achievementId:r})});if(!t.ok)throw Error("Error al asignar el logro");return await t.json()}catch(e){throw console.error(e),e}},i=async e=>{try{let r=await fetch("".concat(a,"/user/").concat(e)),t=await r.json();if(!r.ok||!t.success)throw Error("Error al obtener los datos del usuario");return t}catch(e){throw console.error(e),e}},u=async e=>{try{let r=await fetch("".concat(a,"/game/").concat(e)),t=await r.json();if(!r.ok)throw Error("Error al obtener los detalles del juego");return t}catch(e){throw console.error(e),e}}}},function(e){e.O(0,[971,117,744],function(){return e(e.s=2584)}),_N_E=e.O()}]);