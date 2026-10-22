(() => {
  const $ = id => document.getElementById(id);
  const loginPanel=$("loginPanel"), managerPanel=$("managerPanel"), loginStatus=$("loginStatus"), managerStatus=$("managerStatus");
  const form=$("videoForm"), rows=$("videoRows");
  const configured = window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.includes("PASTE_") && !window.SUPABASE_ANON_KEY.includes("PASTE_");
  const client = configured ? window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY) : null;
  function status(el,message,type=""){el.textContent=message;el.className="status"+(type?" "+type:"")}
  function cleanUrl(value){return value.trim()||null}
  function resetForm(){form.reset();$("videoId").value="";$("tone1").value="#394e69";$("tone2").value="#151a2b";$("saveButton").textContent="Simpan video"}
  function showManager(){loginPanel.hidden=true;managerPanel.hidden=false;loadRows()}
  function showLogin(){managerPanel.hidden=true;loginPanel.hidden=false}
  async function isAdmin(){
    const {data:{user},error}=await client.auth.getUser();
    if(error||!user)return false;
    const {data,error:adminError}=await client.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
    return !adminError && !!data;
  }
  async function checkSession(){
    if(!client){status(loginStatus,"Supabase belum dikonfigurasi. Ikuti README.md untuk membuat project, mengisi URL/key, dan menjalankan SQL.","error");return}
    const {data:{session}}=await client.auth.getSession();
    if(session && await isAdmin()) showManager();
    else if(session){await client.auth.signOut();status(loginStatus,"Akun ini tidak terdaftar sebagai admin.","error")}
  }
  $("loginForm").addEventListener("submit",async e=>{
    e.preventDefault();
    if(!client){status(loginStatus,"Supabase belum dikonfigurasi. Ikuti README.md.","error");return}
    status(loginStatus,"Memeriksa login...");
    const {error}=await client.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
    if(error){status(loginStatus,"Login gagal. Periksa email/password atau konfigurasi Supabase.","error");return}
    if(!(await isAdmin())){await client.auth.signOut();status(loginStatus,"Akun berhasil masuk, tetapi belum diberi hak admin. Tambahkan UUID akun ke tabel admin_users melalui SQL Editor.","error");return}
    status(loginStatus,"Login berhasil.","success");showManager();
  });
  $("logoutButton").addEventListener("click",async()=>{if(client)await client.auth.signOut();showLogin();status(loginStatus,"Kamu sudah keluar.","success")});
  async function loadRows(){
    if(!client)return;
    status(managerStatus,"Memuat data video...");
    const {data,error}=await client.from("videos").select("*").order("created_at",{ascending:false});
    if(error){status(managerStatus,"Gagal membaca data. Pastikan SQL setup sudah dijalankan dan akun ini admin.","error");return}
    rows.replaceChildren();
    (data||[]).forEach(v=>{
      const tr=document.createElement("tr");
      [v.title,v.category,v.date||""].forEach(value=>{const td=document.createElement("td");td.textContent=value||"—";tr.appendChild(td)});
      const action=document.createElement("td");
      const edit=document.createElement("button");edit.className="btn";edit.textContent="Edit";edit.type="button";edit.addEventListener("click",()=>fillForm(v));
      const del=document.createElement("button");del.className="btn danger";del.textContent="Hapus";del.type="button";del.addEventListener("click",()=>deleteVideo(v));
      action.append(edit,del);tr.appendChild(action);rows.appendChild(tr);
    });
    status(managerStatus,`${(data||[]).length} video ditemukan.`,"success");
  }
  function fillForm(v){
    $("videoId").value=v.id;$("title").value=v.title||"";$("category").value=v.category||"";
    $("thumbnail").value=v.thumbnail_url||"";$("videoUrl").value=v.video_url||"";$("label").value=v.label||"";
    $("date").value=v.date||"";$("tone1").value=v.tone1||"#394e69";$("tone2").value=v.tone2||"#151a2b";
    $("saveButton").textContent="Perbarui video";window.scrollTo({top:0,behavior:"smooth"});
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();if(!client)return;
    const record={title:$("title").value.trim(),category:$("category").value.trim(),thumbnail_url:cleanUrl($("thumbnail").value),
      video_url:cleanUrl($("videoUrl").value),label:$("label").value.trim()||$("title").value.trim(),
      date:$("date").value||new Date().toISOString().slice(0,10),tone1:$("tone1").value||"#394e69",tone2:$("tone2").value||"#151a2b"};
    if(!record.title||!record.category){status(managerStatus,"Judul dan kategori wajib diisi.","error");return}
    status(managerStatus,"Menyimpan video...");
    const id=$("videoId").value;
    const result=id?await client.from("videos").update(record).eq("id",id):await client.from("videos").insert(record);
    if(result.error){status(managerStatus,"Gagal menyimpan. Periksa koneksi, SQL, dan hak admin.","error");return}
    resetForm();await loadRows();status(managerStatus,id?"Video berhasil diperbarui.":"Video berhasil ditambahkan.","success");
  });
  async function deleteVideo(v){
    if(!confirm(`Hapus video "${v.title}"? Tindakan ini tidak dapat dibatalkan.`))return;
    status(managerStatus,"Menghapus video...");
    const {error}=await client.from("videos").delete().eq("id",v.id);
    if(error){status(managerStatus,"Gagal menghapus. Pastikan akun memiliki hak admin.","error");return}
    await loadRows();status(managerStatus,"Video berhasil dihapus.","success");
  }
  $("resetButton").addEventListener("click",resetForm);
  checkSession();
})();
