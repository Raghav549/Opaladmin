import React,{useEffect,useMemo,useState}from'react';
const HERO_IMAGE='https://res.cloudinary.com/wholetv/image/upload/v1790069674/wvvcl7fyntc9uewwoe3z.webp';
const HERO_VIDEO='https://res.cloudinary.com/wholetv/video/upload/v1784040316/zdgx29xmmjf7q9dmrcpu.mp4';
import{createRoot}from'react-dom/client';
import{BarChart3,Box,Layers3,Image as ImageIcon,Users,ShoppingBag,TicketPercent,Palette,Settings,Plus,Search,Trash2,Edit3,Eye,Video,ChevronDown,Menu,LayoutDashboard,PackageCheck,Clock3,IndianRupee,MoreHorizontal}from'lucide-react';
import{Bar,BarChart,CartesianGrid,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis,PieChart,Pie,Cell}from'recharts';
import'./styles.css';

type Product={id:number;name:string;category:string;variant:string;status:'Active'|'Draft';images:number;video:boolean;updated:string};
type Category={id:number;name:string,count:number,accent:string};
const SUPABASE_URL='https://jvfmptusadipzdouofdb.supabase.co'; const SUPABASE_KEY='sb_publishable_6Ph-e9YCY3aeEjxfrPqK0g_YwodZsnv';
const productSeed:Product[]=[
{id:1,name:'Opal',category:'Opal',variant:'White',status:'Active',images:5,video:true,updated:'Today'},
{id:2,name:'Emerald',category:'Emerald',variant:'Vivid Green',status:'Active',images:4,video:true,updated:'Today'},
{id:3,name:'Ruby',category:'Ruby',variant:'Pigeon Blood',status:'Active',images:5,video:false,updated:'Yesterday'},
{id:4,name:'Spinel',category:'Spinel',variant:'Royal Blue',status:'Draft',images:2,video:false,updated:'Yesterday'},
{id:5,name:'Agate',category:'Agate',variant:'Black + Gray',status:'Active',images:5,video:true,updated:'2 days ago'}
];
const categories:Category[]=[
{id:1,name:'Opal',count:5,accent:'White / Fire / Crystal / Black / Green'},
{id:2,name:'Pearl',count:1,accent:'Natural'},
{id:3,name:'Tiger Eye',count:1,accent:'Brown gold'},
{id:4,name:'Cat Eye',count:1,accent:'Chatoyant'},
{id:5,name:'Amethyst',count:1,accent:'Violet'},
{id:6,name:'Rock Crystal',count:1,accent:'Clear'},
{id:7,name:'Matura Diamond',count:1,accent:'Clear'},
{id:8,name:'Starlite',count:1,accent:'Blue'},
{id:9,name:'Jacinth',count:1,accent:'Orange red'},
{id:10,name:'Jargoon',count:1,accent:'Honey'},
{id:11,name:'Malacon',count:1,accent:'Dark green'},
{id:12,name:'Emerald',count:3,accent:'Vivid / Bluish / Yellowish green'},
{id:13,name:'Ruby',count:5,accent:'Pigeon blood / Vivid / Purplish / Orangey / Deep red'},
{id:14,name:'Lapis Lazuli',count:1,accent:'Royal blue'},
{id:15,name:'Spinel',count:4,accent:'Royal blue / Nocturnal sky / Evening sky / Denim lapis'},
{id:16,name:'Moonstone',count:1,accent:'Milky blue'},
{id:17,name:'Black Onyx',count:1,accent:'Black'},
{id:18,name:'Agate',count:7,accent:'Red / Blue / Green / Purple / Yellow+Orange / Black+Gray / White+Brown'}
];
const sales=[{name:'Mon',orders:18,revenue:42000},{name:'Tue',orders:24,revenue:58500},{name:'Wed',orders:20,revenue:47000},{name:'Thu',orders:31,revenue:79200},{name:'Fri',orders:29,revenue:68400},{name:'Sat',orders:38,revenue:94500},{name:'Sun',orders:35,revenue:87800}];
const statusData=[{name:'Delivered',value:62},{name:'Pending',value:23},{name:'Processing',value:15}];
const tone=['#171716','#786451','#9c9285'];

function App(){
 const[section,setSection]=useState('Dashboard');
 const[products,setProducts]=useState(()=>{try{return JSON.parse(localStorage.getItem('opal-products')||'null')||productSeed}catch{return productSeed}});
 const[search,setSearch]=useState('');
 const[openEditor,setOpenEditor]=useState<number|null>(null);
 const[selectedTab,setSelectedTab]=useState<'Products'|'Categories'>('Products');
 const[menu,setMenu]=useState(false);
 const filtered=useMemo(()=>products.filter(p=>(p.name+' '+p.category+' '+p.variant).toLowerCase().includes(search.toLowerCase())),[products,search]);
 const deleteProduct=(id:number)=>setProducts(ps=>ps.filter(p=>p.id!==id));
 const [remoteProducts,setRemoteProducts]=useState<any[]>([]);useEffect(()=>{supabase.from('opal_products').select('id,name,slug,category_id,opal_variants(*)').then(({data})=>setRemoteProducts(data||[]))},[]);
 useEffect(()=>localStorage.setItem('opal-products',JSON.stringify(products)),[products]);
 return <div className="adminShell">
  <aside className={'sidebar '+(menu?'open':'')}>
   <div className="adminLogo">Opal<span> Admin</span></div>
   <div className="navGroup">
    {[['Dashboard',LayoutDashboard],['Products',Box],['Categories',Layers3],['Banners',ImageIcon],['Coupons',TicketPercent],['Analytics',BarChart3],['Users',Users],['Orders',ShoppingBag],['Theme',Palette],['Settings',Settings]].map(([label,Icon]:any)=>
      <button key={label} className={section===label?'navItem active':'navItem'} onClick={()=>{setSection(label);setMenu(false)}}><Icon size={16}/><span>{label}</span></button>)}
   </div>
   <div className="sidebarFoot"><div className="adminChip">OA</div><div><strong>Administrator</strong><small>Full access</small></div></div>
  </aside>
  <button className="menuButton" onClick={()=>setMenu(!menu)}><Menu size={18}/></button>

  <main className="content">
   <header className="topbar"><div><small>OPAL CONTROL ROOM</small><h1>{section}</h1></div><div className="topActions"><button className="iconButton"><Search size={16}/></button><button className="avatar">OA</button></div></header>

   {section==='Dashboard'&&<Dashboard/>}
   {section==='Products'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">CATALOGUE</span><h2>Products</h2></div><button className="primary3d" onClick={()=>setOpenEditor(-1)}><Plus size={15}/> Add product</button></div>
     <div className="subNav"><button className={selectedTab==='Products'?'selected':''} onClick={()=>setSelectedTab('Products')}>Products ({products.length})</button><button className={selectedTab==='Categories'?'selected':''} onClick={()=>setSelectedTab('Categories')}>Categories ({categories.length})</button></div>
     {selectedTab==='Products'?<>
       <div className="tableTools"><div className="searchInput"><Search size={14}/><input placeholder="Search products" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="ghost3d">Filter <ChevronDown size={13}/></button></div>
       <div className="tableCard"><table><thead><tr><th>Product</th><th>Category</th><th>Variant</th><th>Media</th><th>Status</th><th>Updated</th><th/></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><div className="productCell"><div className="thumb"/><div><strong>{p.name}</strong><small>#{p.id.toString().padStart(4,'0')}</small></div></div></td><td>{p.category}</td><td>{p.variant}</td><td><span className="mediaBadge">{p.images} img {p.video?<><Video size={12}/>1</>:''}</span></td><td><span className={p.status==='Active'?'status active':'status draft'}>{p.status}</span></td><td>{p.updated}</td><td><div className="rowActions"><button onClick={()=>setOpenEditor(p.id)}><Edit3 size={14}/></button><button onClick={()=>deleteProduct(p.id)}><Trash2 size={14}/></button></div></td></tr>)}</tbody></table></div>
     </>:<div className="categoryGrid">{categories.map(c=><div className="categoryCard" key={c.id}><div className="categoryTop"><span className="categoryNumber">{String(c.id).padStart(2,'0')}</span><div className="rowActions"><button><Edit3 size={14}/></button><button><Trash2 size={14}/></button></div></div><h3>{c.name}</h3><p>{c.accent}</p><strong>{c.count} variants</strong></div>)}</div>}
   </section>}

   {section==='Categories'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">STRUCTURE</span><h2>Categories</h2></div><button className="primary3d"><Plus size={15}/> Add category</button></div><div className="categoryGrid">{categories.map(c=><div className="categoryCard" key={c.id}><div className="categoryTop"><span className="categoryNumber">{String(c.id).padStart(2,'0')}</span><div className="rowActions"><button><Edit3 size={14}/></button><button><Trash2 size={14}/></button></div></div><h3>{c.name}</h3><p>{c.accent}</p><strong>{c.count} variants</strong></div>)}</div></section>}

   {section==='Banners'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">VISUALS</span><h2>Banners</h2></div><button className="primary3d"><Plus size={15}/> Add banner</button></div><div className="bannerManager"><div className="bannerPreview"><img src={HERO_IMAGE}/><div><strong>OPAL HERO</strong><small>Cloudinary hero reference · textless</small></div></div><div className="mediaSource"><label>Hero image URL<input defaultValue={HERO_IMAGE}/></label><label>Hero video URL<input defaultValue={HERO_VIDEO}/></label><button className="primary3d" onClick={()=>alert('Media URLs are ready to connect to your production content store.')}>Save media settings</button></div></div></section>}
{section==='Coupons'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">PROMOTIONS</span><h2>Coupons</h2></div><button className="primary3d"><Plus size={15}/> Add coupon</button></div><div className="couponGrid"><div className="couponCard"><strong>Coupon manager</strong><p>Create, edit, disable and delete discount codes from this control surface.</p><div><span>CODE</span><b>—</b></div><div><span>STATUS</span><b>Not connected</b></div></div><div className="couponCard"><strong>Rules</strong><p>Percentage/fixed discount, minimum order, validity, usage limits and product/category scope.</p></div></div></section>}
{section==='Theme'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">DESIGN SYSTEM</span><h2>Theme</h2></div><button className="primary3d" onClick={()=>alert('Theme configuration saved locally.')}>Save theme</button></div><div className="themeControls"><label>Canvas<input type="color" defaultValue="#ffffff"/></label><label>Ink<input type="color" defaultValue="#171716"/></label><label>Deep gray<input type="color" defaultValue="#777773"/></label><label>Accent brown<input type="color" defaultValue="#786451"/></label></div></section>}
{section==='Settings'&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">SYSTEM</span><h2>Settings</h2></div></div><div className="placeholderPanel"><div className="bigGlyph"><Settings/></div><h3>Platform settings</h3><p>Production authentication, storage, payments, email and database credentials belong in server-side environment variables.</p></div></section>}

   {(section==='Users'||section==='Orders')&&<section className="panel"><div className="panelHead"><div><span className="eyebrow">OPERATIONS</span><h2>{section}</h2></div></div><div className="metricGrid"><Metric icon={<Users/>} label="Total" value="—" note="Connect data source"/><Metric icon={<ShoppingBag/>} label="Active" value="—" note="Awaiting live data"/><Metric icon={<Clock3/>} label="Pending" value="—" note="Awaiting live data"/><Metric icon={<PackageCheck/>} label="Delivered" value="—" note="Awaiting live data"/></div><div className="placeholderPanel small"><p>Live {section.toLowerCase()} records will appear here when the backend data source is connected. No fabricated counts are shown.</p></div></section>}

   {section==='Analytics'&&<Analytics/>}
  </main>
  {openEditor!==null&&<Editor id={openEditor} products={products} setProducts={setProducts} close={()=>setOpenEditor(null)}/>}
 </div>
}

function Dashboard(){return <section className="dashboard"><div className="metricGrid"><Metric icon={<IndianRupee/>} label="Revenue" value="Live data" note="Connect source"/><Metric icon={<ShoppingBag/>} label="Orders" value="Live data" note="Connect source"/><Metric icon={<Users/>} label="Users" value="Live data" note="Connect source"/><Metric icon={<PackageCheck/>} label="Delivery" value="Live data" note="Connect source"/></div><div className="chartGrid"><div className="chartCard"><div className="chartHead"><div><span className="eyebrow">PERFORMANCE</span><h3>Orders & revenue</h3></div><button className="ghost3d">Last 7 days <ChevronDown size={13}/></button></div><ResponsiveContainer width="100%" height={300}><LineChart data={sales}><CartesianGrid stroke="#ece8e0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:'#8c877e'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:'#8c877e'}} axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="revenue" stroke="#786451" strokeWidth={2.5} dot={{r:3,fill:'#786451'}}/><Line type="monotone" dataKey="orders" stroke="#171716" strokeWidth={2}/></LineChart></ResponsiveContainer></div><div className="chartCard"><div className="chartHead"><div><span className="eyebrow">ORDER MIX</span><h3>Status</h3></div></div><ResponsiveContainer width="100%" height={270}><PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={92} dataKey="value">{statusData.map((_,i)=><Cell key={i} fill={tone[i%tone.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="legendRows">{statusData.map((s,i)=><div key={s.name}><span className="dot" style={{background:tone[i%tone.length]}}/><span>{s.name}</span><strong>{s.value}%</strong></div>)}</div></div></div><div className="notice"><Eye size={16}/><div><strong>Demo dashboard shell</strong><p>Charts and summary cards are intentionally connected to clearly labeled sample structures until the real backend is connected.</p></div></div></section>}

function Analytics(){return <section className="dashboard"><div className="panelHead"><div><span className="eyebrow">MEASUREMENT</span><h2>Analytics</h2></div></div><div className="chartGrid three"><div className="chartCard"><div className="chartHead"><div><span className="eyebrow">USERS</span><h3>Growth</h3></div></div><ResponsiveContainer width="100%" height={250}><BarChart data={sales}><CartesianGrid stroke="#eeeae2" vertical={false}/><XAxis dataKey="name" tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><Bar dataKey="orders" fill="#786451" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div><div className="chartCard"><div className="chartHead"><div><span className="eyebrow">REVENUE</span><h3>Trend</h3></div></div><ResponsiveContainer width="100%" height={250}><LineChart data={sales}><CartesianGrid stroke="#eeeae2" vertical={false}/><XAxis dataKey="name" tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><Line type="monotone" dataKey="revenue" stroke="#171716" strokeWidth={2.5}/></LineChart></ResponsiveContainer></div><div className="chartCard"><div className="chartHead"><div><span className="eyebrow">ORDERS</span><h3>Weekly activity</h3></div></div><ResponsiveContainer width="100%" height={250}><BarChart data={sales}><CartesianGrid stroke="#eeeae2" vertical={false}/><XAxis dataKey="name" tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:'#8c877e'}} axisLine={false} tickLine={false}/><Bar dataKey="orders" fill="#171716" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="notice"><BarChart3 size={16}/><div><strong>Analytics schema ready</strong><p>Sample chart geometry is present for preview only. Connect the production data source before treating metrics as live business data.</p></div></div></section>}

function Metric({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}){return <div className="metricCard"><div className="metricIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}

function Editor({id,products,setProducts,close}:{id:number;products:Product[];setProducts:React.Dispatch<React.SetStateAction<Product[]>>;close:()=>void}){const existing=products.find(p=>p.id===id);const [name,setName]=useState(existing?.name||'');const [category,setCategory]=useState(existing?.category||'Opal');const [variant,setVariant]=useState(existing?.variant||'White');const save=()=>{if(id===-1){const next=Math.max(0,...products.map(p=>p.id))+1;setProducts(ps=>[...ps,{id:next,name:name||'New stone',category,variant,status:'Draft',images:0,video:false,updated:'Just now'},]);}else setProducts(ps=>ps.map(p=>p.id===id?{...p,name:name||p.name,category,variant,updated:'Just now'}:p));close()};return <div className="modalBackdrop"><div className="editorModal"><button className="close" onClick={close}>×</button><span className="eyebrow">PRODUCT EDITOR</span><h2>{id===-1?'Add product':'Edit product'}</h2><div className="formGrid"><label>NAME<input value={name} onChange={e=>setName(e.target.value)}/></label><label>CATEGORY<input value={category} onChange={e=>setCategory(e.target.value)}/></label><label>VARIANT<input value={variant} onChange={e=>setVariant(e.target.value)}/></label><label>MEDIA<input value={existing?existing.images:0} readOnly/><small>Max 5 images + 1 video — upload controls can be wired to storage.</small></label></div><div className="uploadSlots">{[1,2,3,4,5].map(i=><button key={i} className="uploadSlot"><ImageIcon size={17}/><span>Image {i}</span></button>)}<button className="uploadSlot"><Video size={17}/><span>Video 1</span></button></div><div className="modalActions"><button className="ghost3d" onClick={close}>Cancel</button><button className="primary3d" onClick={save}>Save product</button></div></div></div>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);