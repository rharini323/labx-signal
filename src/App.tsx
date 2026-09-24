import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import './index.css';

type Project = { name:string; category:string; status:string; description:string; skills:string[]; members:number };
type Startup = { name:string; sector:string; stage:string; location:string; description:string; size:string };
type Mentor = { initials:string; name:string; role:string; expertise:string; availability:string };
type Opportunity = { type:string; title:string; org:string; location:string; deadline:string; tags:string[] };

type Person = { initials:string; name:string; role:string; expertise:string; location:string; status:string; followers:number; following:number };
type RoadmapStage = { number:string; title:string; description:string };
type LeaderboardUser = { name:string; initials:string; role:string; points:number; projects:number; connections:number; coins:number };
type Profile = { name:string; initials:string; role:string; expertise:string; location:string; status:string; bio:string; coins:number; projects:number; followers:number; following:number; achievements:string[] };

const projects: Project[] = [
 {name:'PulseAI',category:'AI',status:'Building',description:'AI-powered workflow intelligence platform for remote teams.',skills:['Python','React','Machine Learning'],members:3},
 {name:'EcoTrack',category:'Mobile',status:'Idea',description:'Personal carbon footprint tracker with actionable insights.',skills:['UI/UX','React Native'],members:1},
 {name:'FinFlow',category:'FinTech',status:'MVP',description:'DeFi dashboard for consolidating crypto assets across chains.',skills:['Solidity','React','TypeScript'],members:4},
 {name:'LearnSpace',category:'EdTech',status:'Scaling',description:'Collaborative study spaces for remote university students.',skills:['WebRTC','React','Node.js'],members:6},
 {name:'MediConnect',category:'HealthTech',status:'Prototype',description:'Telehealth platform for rural communities.',skills:['React','Python','AWS'],members:2},
 {name:'SecureGuard',category:'Cybersecurity',status:'Launch',description:'Automated vulnerability scanning for small businesses.',skills:['Python','Docker','Go'],members:5},
 {name:'CodeSync',category:'Web',status:'Building',description:'Real-time pair programming plugin for VS Code.',skills:['TypeScript','Node.js'],members:2},
 {name:'MarketMate',category:'SaaS',status:'Prototype',description:'AI-driven pricing optimization for e-commerce.',skills:['Data','Python','Machine Learning'],members:3},
 {name:'ArtisanAlley',category:'Web',status:'MVP',description:'Marketplace for local artisans to sell handmade goods.',skills:['React','JavaScript','Marketing'],members:2},
 {name:'DataSense',category:'SaaS',status:'Idea',description:'No-code data visualization tool for marketers.',skills:['UI/UX','JavaScript'],members:1},
 {name:'GreenThumb',category:'Hardware',status:'Prototype',description:'IoT smart planter that waters plants automatically.',skills:['IoT','Python','Hardware'],members:2},
];

const startups: Startup[] = [
 {name:'NovaGrid',sector:'ClimateTech',stage:'Pre-seed',location:'Berlin, Germany',size:'2–10',description:'Decentralized energy trading platform for microgrids.'},
 {name:'AuraHealth',sector:'HealthTech',stage:'Seed',location:'London, UK',size:'11–50',description:'AI-driven personalized mental health diagnostics.'},
 {name:'FinSpire',sector:'EdTech',stage:'Idea',location:'Remote',size:'1',description:'Financial literacy platform for Gen Z.'},
 {name:'CyberShield',sector:'Cybersecurity',stage:'Growth',location:'Austin, TX',size:'51–200',description:'Zero-trust network access for SMEs.'},
 {name:'FoodConnect',sector:'SaaS',stage:'Pre-seed',location:'San Francisco, CA',size:'2–10',description:'B2B marketplace reducing food waste in the supply chain.'},
 {name:'QuantumAI',sector:'AI',stage:'Seed',location:'Boston, MA',size:'11–50',description:'Cloud API for accessing quantum computing algorithms.'},
 {name:'PaySwift',sector:'FinTech',stage:'Growth',location:'Singapore',size:'51–200',description:'Instant cross-border payments for freelancers.'},
 {name:'StyleSense',sector:'Consumer',stage:'Seed',location:'Paris, France',size:'11–50',description:'Virtual try-on technology for online fashion retailers.'},
 {name:'EduVR',sector:'EdTech',stage:'Pre-seed',location:'Toronto, Canada',size:'2–10',description:'Immersive VR field trips for schools.'},
 {name:'AgriTech Solutions',sector:'ClimateTech',stage:'Seed',location:'Denver, CO',size:'11–50',description:'Drone-based crop monitoring and analysis.'},
];

const mentors: Mentor[] = [
 {initials:'MC',name:'Michael Chang',role:'Ex-VP of Product at TechGiant',expertise:'Product',availability:'2 hrs / week'},
 {initials:'SP',name:'Sophia Patel',role:'Lead AI Engineer',expertise:'AI/ML',availability:'4 hrs / week'},
 {initials:'DR',name:'David Rodriguez',role:'Serial Entrepreneur & Angel Investor',expertise:'Fundraising',availability:'1 hr / week'},
 {initials:'ED',name:'Emily Davis',role:'Head of Growth Marketing',expertise:'Marketing',availability:'3 hrs / week'},
 {initials:'WK',name:'William Kim',role:'Principal Software Engineer',expertise:'Engineering',availability:'5 hrs / week'},
 {initials:'OM',name:'Olivia Martinez',role:'Director of UX Design',expertise:'Design',availability:'2 hrs / week'},
 {initials:'JW',name:'James Wilson',role:'VP of Sales',expertise:'Sales',availability:'2 hrs / week'},
 {initials:'CD',name:'Chloe Davis',role:'COO',expertise:'Operations',availability:'3 hrs / week'},
 {initials:'RV',name:'Robert Vance',role:'CEO & Executive Coach',expertise:'Leadership',availability:'1 hr / week'},
 {initials:'AK',name:'Anna Kowalski',role:'Staff Frontend Engineer',expertise:'Engineering',availability:'4 hrs / week'},
 {initials:'MJ',name:'Marcus Johnson',role:'Blockchain Architect',expertise:'Engineering',availability:'2 hrs / week'},
 {initials:'AY',name:'Dr. Amina Yusuf',role:'Chief Medical Officer',expertise:'Product',availability:'1 hr / week'},
];

const opportunities: Opportunity[] = [
 {type:'Hackathon',title:'LabX AI Hackathon 2023',org:'ZeAI',location:'Global',deadline:'Nov 15, 2023',tags:['AI','Machine Learning','Prize']},
 {type:'Grant',title:'ClimateTech Seed Grant',org:'Green Future Fund',location:'US & Canada',deadline:'Dec 1, 2023',tags:['ClimateTech','Funding','Seed']},
 {type:'Internship',title:'Frontend Engineering Intern',org:'NovaGrid',location:'Berlin, Germany',deadline:'Oct 30, 2023',tags:['Frontend','React','Paid']},
 {type:'Program',title:'Web3 Builders Fellowship',org:'DeFi Alliance',location:'Global',deadline:'Nov 5, 2023',tags:['Web3','Mentorship','Crypto']},
 {type:'Job',title:'Senior Product Designer',org:'AuraHealth',location:'London, UK',deadline:'Open',tags:['Design','HealthTech','Full-time']},
 {type:'Program',title:'Women in Tech Mentorship Circle',org:'TechLadies',location:'Global',deadline:'Oct 25, 2023',tags:['Mentorship','Community']},
 {type:'Event',title:'EdTech Startup Pitch Competition',org:'LearnCapital',location:'San Francisco, CA',deadline:'Nov 20, 2023',tags:['Pitch','EdTech','Funding']},
 {type:'Grant',title:'Open Source Contributor Grant',org:'DevSustain',location:'Global',deadline:'Dec 15, 2023',tags:['Open Source','Funding']},
 {type:'Internship',title:'Data Science Intern',org:'MarketMate',location:'Remote',deadline:'Oct 28, 2023',tags:['Data Science','Python','Internship']},
 {type:'Program',title:'SaaS Founder Masterclass',org:'GrowthAcademy',location:'Global',deadline:'Nov 10, 2023',tags:['SaaS','Education','Growth']},
 {type:'Hackathon',title:'Cybersecurity Innovation Challenge',org:'SecureNet',location:'Global',deadline:'Dec 5, 2023',tags:['Cybersecurity','Challenge']},
 {type:'Program',title:'Hardware Startup Accelerator',org:'MakeIt',location:'Shenzhen, China',deadline:'Nov 30, 2023',tags:['Hardware','Accelerator','Manufacturing']},
];


const people: Person[] = [
 {initials:'AR',name:'Alex Rivera',role:'Product Builder',expertise:'AI / Product',location:'Remote',status:'Building',followers:42,following:18},
 {initials:'SK',name:'Sarah Kim',role:'Startup Founder',expertise:'ClimateTech',location:'Singapore',status:'Looking for collaborators',followers:37,following:24},
 {initials:'JM',name:'James Morgan',role:'Software Engineer',expertise:'Engineering',location:'London, UK',status:'Open to projects',followers:31,following:15},
 {initials:'NP',name:'Nina Patel',role:'Product Designer',expertise:'UX / Design',location:'Bangalore, India',status:'Available',followers:28,following:21},
 {initials:'DL',name:'Daniel Lee',role:'Founder',expertise:'FinTech',location:'Singapore',status:'Building',followers:54,following:32},
 {initials:'RM',name:'Rachel Morgan',role:'Growth Strategist',expertise:'Marketing',location:'Remote',status:'Open to opportunities',followers:46,following:29},
 {initials:'KT',name:'Kevin Thomas',role:'ML Engineer',expertise:'AI / ML',location:'Toronto, Canada',status:'Building',followers:39,following:17},
 {initials:'AM',name:'Aisha Malik',role:'Community Builder',expertise:'Community',location:'Dubai, UAE',status:'Connecting people',followers:61,following:44}
];

const roadmap: RoadmapStage[] = [
 {number:'01',title:'DISCOVER',description:'Explore projects, startups, mentors, people and opportunities inside the LabX ecosystem.'},
 {number:'02',title:'CONNECT',description:'Connect with builders, founders, mentors and other community members.'},
 {number:'03',title:'BUILD',description:'Join projects, contribute your skills and work with teams.'},
 {number:'04',title:'VALIDATE',description:'Get feedback, improve your idea and validate your product.'},
 {number:'05',title:'LAUNCH',description:'Turn your project into a real product, startup or public launch.'},
 {number:'06',title:'GROW',description:'Find funding, talent, partnerships, customers and new opportunities.'}
];

const leaderboard: LeaderboardUser[] = [
 {name:'Aisha Malik',initials:'AM',role:'Community Builder',points:1240,projects:8,connections:61,coins:1680},
 {name:'Daniel Lee',initials:'DL',role:'Founder',points:1180,projects:5,connections:54,coins:1520},
 {name:'Alex Rivera',initials:'AR',role:'Product Builder',points:1095,projects:7,connections:42,coins:1250},
 {name:'Sarah Kim',initials:'SK',role:'Startup Founder',points:1020,projects:5,connections:37,coins:1390},
 {name:'Kevin Thomas',initials:'KT',role:'ML Engineer',points:950,projects:6,connections:39,coins:1180},
 {name:'Rachel Morgan',initials:'RM',role:'Growth Strategist',points:875,projects:4,connections:46,coins:1040}
];

const profiles: Profile[] = people.map(person => ({
  ...person,
  bio: `${person.name} is a ${person.role.toLowerCase()} focused on ${person.expertise.toLowerCase()} and building meaningful work inside the LabX ecosystem.`,
  coins: person.name === 'Alex Rivera' ? 1250 : person.name === 'Aisha Malik' ? 1680 : person.name === 'Daniel Lee' ? 1520 : person.name === 'Sarah Kim' ? 1390 : person.name === 'Kevin Thomas' ? 1180 : 1040,
  projects: person.name === 'Alex Rivera' ? 7 : person.name === 'Aisha Malik' ? 8 : person.name === 'Daniel Lee' ? 5 : person.name === 'Sarah Kim' ? 5 : person.name === 'Kevin Thomas' ? 6 : 4,
  achievements: person.name === 'Alex Rivera' ? ['Early Builder', 'Community Contributor', 'Project Creator'] : ['LabX Member', 'Community Contributor']
}));


function SignalField(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current; if(!canvas)return;
  const ctx=canvas.getContext('2d'); if(!ctx)return;
  let raf=0,w=0,h=0; const dpr=Math.min(devicePixelRatio||1,2);
  const nodes=Array.from({length:28},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00014,vy:(Math.random()-.5)*.00009,p:Math.random()*Math.PI*2}));
  const resize=()=>{w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};
  const draw=()=>{
   ctx.clearRect(0,0,w,h);
   const t=performance.now()*.00035;
   const g=ctx.createRadialGradient(w*.52,h*.18,0,w*.52,h*.18,Math.max(w,h)*.75);g.addColorStop(0,'rgba(91,124,250,.13)');g.addColorStop(.42,'rgba(92,225,230,.045)');g.addColorStop(1,'rgba(7,10,16,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>1)n.vx*=-1;if(n.y<0||n.y>1)n.vy*=-1});
   for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],dx=(a.x-b.x)*w,dy=(a.y-b.y)*h,d=Math.hypot(dx,dy);if(d<180){ctx.strokeStyle=`rgba(115,150,255,${(1-d/180)*.055})`;ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.lineTo(b.x*w,b.y*h);ctx.stroke()}}
   nodes.forEach(n=>{const pulse=.5+.5*Math.sin(t*2+n.p);ctx.fillStyle=`rgba(92,225,230,${.08+.12*pulse})`;ctx.beginPath();ctx.arc(n.x*w,n.y*h,.8+1.2*pulse,0,Math.PI*2);ctx.fill()});
   raf=requestAnimationFrame(draw);
  };
  resize();addEventListener('resize',resize);draw();return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize)};
 },[]);
 return <canvas ref={ref} className="signal-field" aria-hidden="true"/>;
}

function ThreeHero(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,8);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);
  const root=new THREE.Group();scene.add(root);
  const ambient=new THREE.AmbientLight(0x9db7ff,1.5);scene.add(ambient);
  const key=new THREE.DirectionalLight(0x5ce1e6,4);key.position.set(4,5,7);scene.add(key);
  const rim=new THREE.DirectionalLight(0x6d7cff,3);rim.position.set(-5,-2,4);scene.add(rim);

  const coreMat=new THREE.MeshPhysicalMaterial({color:0x111827,metalness:.82,roughness:.2,clearcoat:1,clearcoatRoughness:.08});
  const edgeMat=new THREE.MeshBasicMaterial({color:0x5ce1e6,wireframe:true,transparent:true,opacity:.72});
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,2),coreMat);root.add(core);
  const edge=new THREE.Mesh(new THREE.IcosahedronGeometry(1.31,2),edgeMat);root.add(edge);

  const ringMat=new THREE.MeshBasicMaterial({color:0x5b7cfa,transparent:true,opacity:.55});
  const ring1=new THREE.Mesh(new THREE.TorusGeometry(1.72,.018,12,160),ringMat);ring1.rotation.x=.8;root.add(ring1);
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.05,.012,12,160),new THREE.MeshBasicMaterial({color:0x5ce1e6,transparent:true,opacity:.28}));ring2.rotation.x=-.9;ring2.rotation.y=.35;root.add(ring2);
  const ring3=new THREE.Mesh(new THREE.TorusGeometry(2.38,.008,12,160),new THREE.MeshBasicMaterial({color:0xb9c7ff,transparent:true,opacity:.18}));ring3.rotation.y=1.15;root.add(ring3);

  const nodes=new THREE.Group();root.add(nodes);
  const nodeGeo=new THREE.OctahedronGeometry(.12,1);
  const nodeMats=[0x5ce1e6,0x5b7cfa,0xe8eef7];
  for(let i=0;i<9;i++){
   const m=new THREE.Mesh(nodeGeo,new THREE.MeshStandardMaterial({color:nodeMats[i%3],metalness:.5,roughness:.22,emissive:nodeMats[i%3],emissiveIntensity:.35}));
   const a=i/9*Math.PI*2;m.position.set(Math.cos(a)*2.05,Math.sin(a*1.7)*.55,Math.sin(a)*2.05);nodes.add(m);
  }

  const lineGroup=new THREE.Group();root.add(lineGroup);
  const lineMat=new THREE.LineBasicMaterial({color:0x6d7cff,transparent:true,opacity:.22});
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const pts=[new THREE.Vector3(Math.cos(a)*1.3,Math.sin(a)*.45,Math.sin(a)*1.3),new THREE.Vector3(Math.cos(a+.65)*2.05,Math.sin(a+.65)*.55,Math.sin(a+.65)*2.05)];lineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lineMat));}

  const pointer={x:0,y:0,tx:0,ty:0};
  const onMove=(e:MouseEvent)=>{pointer.tx=(e.clientX/innerWidth-.5)*1.35;pointer.ty=(e.clientY/innerHeight-.5)*1.0};
  const onLeave=()=>{pointer.tx=0;pointer.ty=0};
  addEventListener('mousemove',onMove);addEventListener('mouseleave',onLeave);
  const resize=()=>{const box=canvas.getBoundingClientRect();const width=Math.max(1,box.width),height=Math.max(1,box.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()};
  const clock=new THREE.Clock();
  const animate=()=>{const t=clock.getElapsedTime();pointer.x+=(pointer.tx-pointer.x)*.045;pointer.y+=(pointer.ty-pointer.y)*.045;root.rotation.y+=.0022;root.rotation.x=Math.sin(t*.28)*.035+pointer.y*.28;root.rotation.z=pointer.x*.07;core.rotation.y=t*.12;edge.rotation.y=-t*.16;ring1.rotation.z=t*.22;ring2.rotation.z=-t*.15;ring3.rotation.x=t*.1;nodes.rotation.y=-t*.18;nodes.rotation.x=Math.sin(t*.3)*.08;lineGroup.rotation.y=t*.08;renderer.render(scene,camera);raf=requestAnimationFrame(animate)};
  let raf=0;resize();addEventListener('resize',resize);animate();
  return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('mousemove',onMove);removeEventListener('mouseleave',onLeave);renderer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const m=o.material;Array.isArray(m)?m.forEach(x=>x.dispose()):m.dispose()}})};
 },[]);
 return <div className="three-hero"><canvas ref={ref}/><div className="three-caption"><span>INTERACTIVE SYSTEM</span><b>MOVE THE FIELD</b></div></div>;
}
function ThreeSectionVisual({variant}:{variant:'projects'|'startups'|'mentors'|'opportunities'|'about'|'journey'}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,7.4);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);
  const root=new THREE.Group();scene.add(root);
  scene.add(new THREE.AmbientLight(0x9fb7ff,1.7));
  const key=new THREE.PointLight(0x5ce1e6,18,22);key.position.set(4,4,6);scene.add(key);
  const fill=new THREE.PointLight(0x5b7cfa,14,20);fill.position.set(-4,-2,4);scene.add(fill);
  const white=new THREE.MeshPhysicalMaterial({color:0xe9eff8,metalness:.76,roughness:.17,clearcoat:1,clearcoatRoughness:.08});
  const cyan=new THREE.MeshPhysicalMaterial({color:0x5ce1e6,metalness:.5,roughness:.16,emissive:0x12434b,emissiveIntensity:.8,clearcoat:1});
  const blue=new THREE.MeshPhysicalMaterial({color:0x5b7cfa,metalness:.6,roughness:.19,emissive:0x17245e,emissiveIntensity:.6,clearcoat:1});
  const dark=new THREE.MeshPhysicalMaterial({color:0x0b111c,metalness:.9,roughness:.2,clearcoat:1});
  const lineMat=new THREE.LineBasicMaterial({color:0x7e9bff,transparent:true,opacity:.32});
  const objects:THREE.Object3D[]=[];
  const add=(o:THREE.Object3D)=>{root.add(o);objects.push(o);return o};
  const addLine=(a:THREE.Vector3,b:THREE.Vector3,opacity=.32)=>{
   const mat=lineMat.clone();mat.opacity=opacity;const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),mat);add(line);return line;
  };
  const addRing=(r:number,rotX:number,rotY:number,opacity=.3)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,10,160),new THREE.MeshBasicMaterial({color:0x5ce1e6,transparent:true,opacity}));ring.rotation.set(rotX,rotY,0);add(ring);return ring};
  const rings:THREE.Object3D[]=[];

  if(variant==='projects'){
   // Exploded product architecture: independent layers assemble around a core.
   const stack=new THREE.Group();add(stack);
   const layers=[{y:1.05,s:.72,m:blue},{y:.35,s:1.0,m:white},{y:-.38,s:.82,m:cyan},{y:-1.02,s:.62,m:blue}];
   layers.forEach((l,i)=>{
    const box=new THREE.Mesh(new THREE.BoxGeometry(1.7*l.s,.38,1.18*l.s),l.m);box.position.y=l.y;box.rotation.set(.12+i*.035,.18-i*.05,-.08);stack.add(box);
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry),new THREE.LineBasicMaterial({color:0x9bb0ff,transparent:true,opacity:.28}));edge.position.copy(box.position);edge.rotation.copy(box.rotation);stack.add(edge);
   });
   const core=new THREE.Mesh(new THREE.BoxGeometry(.82,.46,.72),dark);core.position.set(0,.03,.02);stack.add(core);
   rings.push(addRing(2.05,.95,.15,.22));
  } else if(variant==='startups'){
   // Startup constellation: a central seed with independently orbiting companies.
   const hub=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,2),cyan);add(hub);
   const halo=addRing(1.05,Math.PI/2,.1,.32);rings.push(halo);
   const orbiters=new THREE.Group();add(orbiters);
   for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2;const radius=1.65+(i%2)*.28;const m=new THREE.Mesh(i%3===0?new THREE.TetrahedronGeometry(.2,1):new THREE.OctahedronGeometry(.16,1),i%2?blue:white);m.position.set(Math.cos(a)*radius,Math.sin(a*2)*.58,Math.sin(a)*radius);orbiters.add(m);addLine(new THREE.Vector3(0,0,0),m.position,.16);
   }
   rings.push(addRing(1.7,.65,.8,.16),addRing(2.25,-.35,1.1,.1));
  } else if(variant==='mentors'){
   // Stylized 3D mentor bust with expertise orbiting the head.
   const bust=new THREE.Group();add(bust);
   const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.72,.95,8,18),dark);torso.scale.set(1.0,.78,.72);torso.position.y=-.72;bust.add(torso);
   const neck=new THREE.Mesh(new THREE.CylinderGeometry(.23,.3,.42,24),white);neck.position.y=.05;bust.add(neck);
   const head=new THREE.Mesh(new THREE.SphereGeometry(.62,32,24),white);head.scale.set(.9,1.05,.9);head.position.y=.72;bust.add(head);
   const shoulder=new THREE.Mesh(new THREE.TorusGeometry(.78,.11,10,80,Math.PI),cyan);shoulder.rotation.x=Math.PI/2;shoulder.position.y=-.45;bust.add(shoulder);
   for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),i%2?cyan:blue);m.position.set(Math.cos(a)*1.55,Math.sin(a*1.7)*.75+.15,Math.sin(a)*1.55);add(m);addLine(new THREE.Vector3(0,.45,0),m.position,.12)}
   rings.push(addRing(1.55,Math.PI/2,.15,.2));
  } else if(variant==='opportunities'){
   // Opportunity wheel: six physical segments rotate as a mechanical dial.
   const wheel=new THREE.Group();add(wheel);
   const segmentMat=[cyan,blue,white,blue,cyan,white];
   for(let i=0;i<6;i++){
    const a=i/6*Math.PI*2;const seg=new THREE.Mesh(new THREE.BoxGeometry(.72,.24,1.35),segmentMat[i]);seg.position.set(Math.cos(a)*1.18,Math.sin(a)*.42,Math.sin(a)*1.18);seg.rotation.y=a;seg.rotation.z=-.18;wheel.add(seg);
   }
   const axle=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.8,32),dark);axle.rotation.z=Math.PI/2;wheel.add(axle);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.14,32),white);cap.rotation.z=Math.PI/2;wheel.add(cap);
   rings.push(addRing(1.85,.7,.25,.2));
  } else if(variant==='about'){
   // Architectural LabX monolith: stacked planes with a floating central spine.
   const building=new THREE.Group();add(building);
   for(let i=0;i<5;i++){
    const slab=new THREE.Mesh(new THREE.BoxGeometry(2.35-i*.18,.22,1.35-i*.1),i===2?cyan:(i%2?blue:dark));slab.position.y=(i-2)*.45;slab.rotation.y=(i-2)*.08;building.add(slab);
   }
   const spine=new THREE.Mesh(new THREE.BoxGeometry(.22,3.0,.22),white);spine.position.z=.18;building.add(spine);
   const top=new THREE.Mesh(new THREE.CylinderGeometry(.38,.52,.18,6),cyan);top.position.y=1.42;building.add(top);
   rings.push(addRing(2.15,.9,.2,.13));
  } else {
   // Journey tunnel: six gates receding into depth, giving a clear sense of progress.
   const tunnel=new THREE.Group();add(tunnel);
   for(let i=0;i<6;i++){
    const z=i*-.82+.9;const mat=i%2?blue:cyan;
    const left=new THREE.Mesh(new THREE.BoxGeometry(.08,1.65,.08),mat);left.position.set(-1.25,0,z);tunnel.add(left);
    const right=left.clone();right.position.x=1.25;tunnel.add(right);
    const top=new THREE.Mesh(new THREE.BoxGeometry(2.58,.08,.08),mat);top.position.set(0,.78,z);tunnel.add(top);
   }
   const core=new THREE.Mesh(new THREE.OctahedronGeometry(.36,1),white);core.position.set(0,0,-3.1);tunnel.add(core);
  }

  const pointer={x:0,y:0,tx:0,ty:0};
  const onMove=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();pointer.tx=((e.clientX-r.left)/r.width-.5)*1.35;pointer.ty=((e.clientY-r.top)/r.height-.5)*1.05};
  const onLeave=()=>{pointer.tx=0;pointer.ty=0};
  canvas.addEventListener('mousemove',onMove);canvas.addEventListener('mouseleave',onLeave);
  const resize=()=>{const r=canvas.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  const clock=new THREE.Clock();let raf=0;
  const animate=()=>{
   const t=clock.getElapsedTime();pointer.x+=(pointer.tx-pointer.x)*.055;pointer.y+=(pointer.ty-pointer.y)*.055;
   root.rotation.y=pointer.x*.26+Math.sin(t*.18)*.04;root.rotation.x=pointer.y*.22+Math.cos(t*.22)*.025;root.rotation.z=pointer.x*.035;
   if(variant==='projects') root.children[0].rotation.y=t*.14;
   if(variant==='startups') root.children[2].rotation.y=t*.12;
   if(variant==='mentors') root.children[0].rotation.y=t*.08;
   if(variant==='opportunities') root.children[0].rotation.y=t*.16;
   if(variant==='about') root.children[0].rotation.y=Math.sin(t*.2)*.08;
   if(variant==='journey') root.children[0].position.z=Math.sin(t*.35)*.05;
   rings.forEach((r,i)=>{r.rotation.z+=(i%2?-.002:.0015);r.rotation.x+=.0004});
   renderer.render(scene,camera);raf=requestAnimationFrame(animate);
  };
  resize();addEventListener('resize',resize);animate();
  return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);canvas.removeEventListener('mousemove',onMove);canvas.removeEventListener('mouseleave',onLeave);renderer.dispose();scene.traverse(o=>{const obj=o as any;if(obj.geometry)obj.geometry.dispose();if(obj.material){const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach((m:any)=>m.dispose())}})};
 },[variant]);
 const labels={projects:['PROJECT ARCHITECTURE','MOVE CURSOR'],startups:['STARTUP CONSTELLATION','MOVE CURSOR'],mentors:['MENTOR NETWORK','MOVE CURSOR'],opportunities:['OPPORTUNITY DIAL','MOVE CURSOR'],about:['LABX STRUCTURE','MOVE CURSOR'],journey:['MOMENTUM PATH','MOVE CURSOR']} as const;
 return <div className={`section-3d section-3d-${variant}`}><canvas ref={ref}/><div className="section-3d-label"><span>{labels[variant][0]}</span><b>{labels[variant][1]}</b></div></div>;
}
function SectionTitle({eyebrow,title,children}:{eyebrow:string;title:string;children?:ReactNode}){return <div className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children&&<p>{children}</p>}</div>}
function Search({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder:string}){return <label className="search"><span>⌕</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{value&&<button onClick={()=>onChange('')} aria-label="Clear search">×</button>}</label>}

function App(){
 const [projectQ,setProjectQ]=useState('');
 const [startupQ,setStartupQ]=useState('');
 const [mentorQ,setMentorQ]=useState('');
 const [oppQ,setOppQ]=useState('');
 const [peopleQ,setPeopleQ]=useState('');
 const [active,setActive]=useState('discover');
 const [selectedProfile,setSelectedProfile]=useState<string|null>(null);
 const currentUserName=localStorage.getItem('labx_current_user') || 'Alex Rivera';
 const currentProfile=profiles.find(p=>p.name===currentUserName) || profiles[0];
 const [followedPeople,setFollowedPeople]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('labx_following')||'[]')}catch{return []}});
 const [completedStages,setCompletedStages]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('labx_roadmap')||'[]')}catch{return []}});
 const [coinBalance,setCoinBalance]=useState<number>(()=>{try{return Number(localStorage.getItem('labx_coins')||String(currentProfile.coins))}catch{return currentProfile.coins}});
 const filter=(arr:any[],q:string)=>{const s=q.trim().toLowerCase();return s?arr.filter(x=>JSON.stringify(x).toLowerCase().includes(s)):arr};
 const fp=useMemo(()=>filter(projects,projectQ),[projectQ]);
 const fs=useMemo(()=>filter(startups,startupQ),[startupQ]);
 const fm=useMemo(()=>filter(mentors,mentorQ),[mentorQ]);
 const fo=useMemo(()=>filter(opportunities,oppQ),[oppQ]);
 const fpeople=useMemo(()=>filter(people,peopleQ),[peopleQ]);
 useEffect(()=>{localStorage.setItem('labx_following',JSON.stringify(followedPeople))},[followedPeople]);
 useEffect(()=>{localStorage.setItem('labx_roadmap',JSON.stringify(completedStages))},[completedStages]);
 useEffect(()=>{localStorage.setItem('labx_coins',String(coinBalance))},[coinBalance]);
 const awardCoins=(amount:number)=>setCoinBalance(current=>current+amount);
 const toggleFollow=(name:string)=>{if(followedPeople.includes(name)){setFollowedPeople(current=>current.filter(person=>person!==name));return;}setFollowedPeople(current=>[...current,name]);awardCoins(10)};
 const toggleStage=(number:string)=>{if(completedStages.includes(number)){setCompletedStages(current=>current.filter(item=>item!==number));return;}setCompletedStages(current=>[...current,number]);awardCoins(50)};
 const roadmapProgress=Math.round((completedStages.length/roadmap.length)*100);
 const personalizedLeaderboard=useMemo(()=>leaderboard.map(user=>user.name===currentUserName?{...user,coins:coinBalance,points:user.points+(followedPeople.length*10)+(completedStages.length*50)}:user).sort((a,b)=>b.points-a.points),[coinBalance,followedPeople.length,completedStages.length]);
 useEffect(()=>{const ids=['discover','projects','startups','mentors','opportunities','people','followers','roadmap','leaderboard','about','profile-view'];const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-35% 0px -55% 0px'});ids.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el)});return()=>obs.disconnect()},[]);
 const go=(id:string)=>{const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});setActive(id)}};
 const openProfile=(name:string)=>{setSelectedProfile(name);setActive('profile-view')};
 useEffect(()=>{if(!selectedProfile)return;const timer=window.setTimeout(()=>{document.getElementById('profile-view')?.scrollIntoView({behavior:'smooth',block:'start'})},50);return()=>window.clearTimeout(timer)},[selectedProfile]);
 const getProfile=(name:string):Profile|null=>{
  if(name===currentUserName)return {...currentProfile,coins:coinBalance,following:followedPeople.length};
  const personProfile=profiles.find(profile=>profile.name===name);
  if(personProfile)return personProfile;
  const mentor=mentors.find(item=>item.name===name);
  if(mentor)return {
    name:mentor.name,
    initials:mentor.initials,
    role:mentor.role,
    expertise:mentor.expertise,
    location:'LabX Mentor Network',
    status:`Available — ${mentor.availability}`,
    bio:`${mentor.name} is a LabX mentor specializing in ${mentor.expertise.toLowerCase()}. ${mentor.role}.`,
    coins:0,
    projects:0,
    followers:0,
    following:0,
    achievements:['LabX Mentor','Mentor Network',`${mentor.availability} availability`]
  };
  return null;
};
 return <div className="app"><SignalField/>
  <header className="nav"><div className="brand" onClick={()=>go('discover')}><b>LAB<span>X</span></b><small>INNOVATION / EXECUTION</small></div><nav>{['discover','projects','startups','mentors','opportunities','people','followers','roadmap','leaderboard','about'].map(id=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}>{id==='discover'?'01 / DISCOVER':id==='projects'?'PROJECTS':id==='startups'?'STARTUPS':id==='mentors'?'MENTORS':id==='opportunities'?'OPPORTUNITIES':id==='people'?'PEOPLE':id==='followers'?'FOLLOWERS':id==='roadmap'?'ROADMAP':id==='leaderboard'?'LEADERBOARD':'ABOUT'}</button>)}</nav><button className="nav-cta" onClick={()=>go('opportunities')}>ENTER ECOSYSTEM <span>↗</span></button></header>
  <main>
   <section id="discover" className="hero"><div className="hero-copy"><span className="kicker">ZEAI SOFT / LABX</span><h1>BUILD<br/><em>WHAT'S NEXT.</em></h1><p>One operating layer for ideas, people, products, startups, and the opportunities that move them forward.</p><div className="hero-actions"><button className="primary" onClick={()=>go('projects')}>EXPLORE THE ECOSYSTEM ↗</button><button className="ghost" onClick={()=>go('roadmap')}>HOW IT WORKS</button></div><div className="hero-stats"><span><b>{projects.length}+</b> PROJECTS</span><span><b>{startups.length}</b> STARTUPS</span><span><b>{mentors.length}</b> MENTORS</span></div></div><div className="hero-map"><ThreeHero/><div className="map-label map-label-a">01 / IDEAS</div><div className="map-label map-label-b">02 / PEOPLE</div><div className="map-label map-label-c">03 / PRODUCTS</div><div className="map-label map-label-d">04 / MOMENTUM</div></div></section>
   <section className="strip"><span>IDEA</span><i/><span>PEOPLE</span><i/><span>PRODUCT</span><i/><span>TRACTION</span><i/><span>GROWTH</span></section>
   <section id="projects" className="section"><div className="section-intro-grid"><SectionTitle eyebrow="01 / BUILD" title="Find something worth building.">Ideas with teams already moving. Search the ecosystem and find where you fit.</SectionTitle><ThreeSectionVisual variant="projects"/></div><Search value={projectQ} onChange={setProjectQ} placeholder="Search projects, skills, status..."/><div className="result-line">{fp.length} PROJECTS FOUND</div><div className="project-list">{fp.map((p,i)=><article className="project-row" key={p.name}><span className="index">{String(i+1).padStart(2,'0')}</span><div><small>{p.category} / {p.status}</small><h3>{p.name}</h3><p>{p.description}</p><div className="tags">{p.skills.map((s: string)=><span key={s}>{s}</span>)}</div></div><div className="row-meta"><span>{p.members} MEMBERS</span><b>→</b></div></article>)}</div></section>
   <section id="startups" className="section"><div className="section-intro-grid"><SectionTitle eyebrow="02 / SCALE" title="Startups building what comes next.">Early-stage companies looking for talent, partners, customers, and momentum.</SectionTitle><ThreeSectionVisual variant="startups"/></div><Search value={startupQ} onChange={setStartupQ} placeholder="Search startups, sectors, locations..."/><div className="startup-wall">{fs.map((s,i)=><article className="startup-tile" key={s.name}><div className="tile-top"><span>{String(i+1).padStart(2,'0')}</span><small>{s.stage}</small></div><h3>{s.name}</h3><p>{s.description}</p><div className="tile-bottom"><span>{s.sector}</span><span>{s.location}</span><span>{s.size}</span></div></article>)}</div></section>
   <section id="mentors" className="section"><div className="section-intro-grid"><SectionTitle eyebrow="03 / PEOPLE" title="People who move builders forward.">Operators, founders, engineers, designers, and leaders with time to help.</SectionTitle><ThreeSectionVisual variant="mentors"/></div><Search value={mentorQ} onChange={setMentorQ} placeholder="Search mentors, roles, expertise..."/><div className="mentor-index">{fm.map((m,i)=><article className="mentor-row" key={m.name}><div className="initials">{m.initials}</div><div className="mentor-main"><small>0{i+1} / {m.expertise}</small><h3>{m.name}</h3><p>{m.role}</p></div><div className="mentor-availability"><span>{m.availability}</span><button className="ghost" onClick={()=>openProfile(m.name)}>VIEW PROFILE</button></div></article>)}</div></section>
   <section id="opportunities" className="section"><div className="section-intro-grid"><SectionTitle eyebrow="04 / MOMENTUM" title="Opportunities worth moving for.">Jobs, internships, grants, programs, events, and challenges across the ecosystem.</SectionTitle><ThreeSectionVisual variant="opportunities"/></div><Search value={oppQ} onChange={setOppQ} placeholder="Search opportunities, organizations, tags..."/><div className="opportunity-feed">{fo.map(o=><article className="opp-row" key={o.title}><div className="opp-date"><b>{o.deadline.split(' ')[0]}</b><span>{o.deadline.split(' ').slice(1).join(' ')}</span></div><div><small>{o.type} / {o.org}</small><h3>{o.title}</h3><p>{o.location}</p><div className="tags">{o.tags.map((t: string)=><span key={t}>{t}</span>)}</div></div><b className="arrow">↗</b></article>)}</div></section>
   <section id="people" className="section"><div className="section-intro-grid"><SectionTitle eyebrow="05 / COMMUNITY" title="People building inside LabX.">Discover builders, founders, designers, engineers and people looking to collaborate.</SectionTitle><ThreeSectionVisual variant="mentors"/></div><div className="project-row" style={{marginBottom:'28px'}}><div className="initials">{currentProfile.initials}</div><div><small>LOGGED-IN PROFILE</small><h3>{currentProfile.name}</h3><p>{currentProfile.role} · {currentProfile.expertise} · {currentProfile.location}</p></div><div className="row-meta"><span>{coinBalance} COINS</span><button className="ghost" onClick={()=>openProfile(currentUserName)}>VIEW PROFILE</button></div></div><Search value={peopleQ} onChange={setPeopleQ} placeholder="Search people, roles, expertise, location..."/><div className="result-line">{fpeople.length} PEOPLE FOUND</div><div className="mentor-index">{fpeople.map((p,i)=>{const following=followedPeople.includes(p.name);return <article className="mentor-row" key={p.name}><div className="initials">{p.initials}</div><div className="mentor-main"><small>0{i+1} / {p.expertise}</small><h3>{p.name}</h3><p>{p.role} · {p.location}</p></div><div className="mentor-availability"><span>{p.followers + (following?1:0)} FOLLOWERS</span><button className="ghost" onClick={()=>toggleFollow(p.name)}>{following?'FOLLOWING':'FOLLOW'}</button><button className="ghost" onClick={()=>openProfile(p.name)}>PROFILE</button></div></article>})}</div>{selectedProfile&&(()=>{const profile=getProfile(selectedProfile);if(!profile)return null;return <section id="profile-view" className="section" style={{marginTop:'36px'}}><article className="project-row"><div className="initials">{profile.initials}</div><div><small>{profile.name===currentUserName?'MY PROFILE':'LABX PROFILE'} / {profile.expertise}</small><h3>{profile.name}</h3><p>{profile.bio}</p><div className="tags"><span>{profile.role}</span><span>{profile.location}</span><span>{profile.status}</span></div></div><div className="row-meta"><span>{profile.coins} COINS</span><button className="ghost" onClick={()=>setSelectedProfile(null)}>CLOSE</button></div></article><article className="project-row"><span className="index">STATS</span><div><small>COMMUNITY ACTIVITY</small><p>{profile.projects} PROJECTS · {profile.followers} FOLLOWERS · {profile.following} FOLLOWING</p><div className="tags">{profile.achievements.map(a=><span key={a}>{a}</span>)}</div></div></article></section>})()}</section>
   <section id="followers" className="section"><SectionTitle eyebrow="06 / COMMUNITY" title="Your network.">See the people you are following and manage your connections.</SectionTitle><div className="result-line">{followedPeople.length} FOLLOWING</div><div className="mentor-index">{people.filter(p=>followedPeople.includes(p.name)).map(p=><article className="mentor-row" key={p.name}><div className="initials">{p.initials}</div><div className="mentor-main"><small>{p.expertise}</small><h3>{p.name}</h3><p>{p.role} · {p.location}</p></div><div className="mentor-availability"><span>{p.followers + 1} FOLLOWERS</span><button className="ghost" onClick={()=>openProfile(p.name)}>PROFILE</button><button className="ghost" onClick={()=>toggleFollow(p.name)}>FOLLOWING</button></div></article>)}</div>{followedPeople.length===0&&<div className="result-line">FOLLOW PEOPLE FROM THE COMMUNITY TO BUILD YOUR NETWORK.</div>}</section>
   <section id="roadmap" className="section roadmap-section">
    <div className="section-intro-grid"><SectionTitle eyebrow="07 / ROADMAP" title="Your journey through LabX.">A clear path from discovering an idea to building, validating, launching and growing it.</SectionTitle><ThreeSectionVisual variant="journey"/></div>
    <div className="roadmap-summary"><div className="roadmap-summary-main"><span className="roadmap-label">YOUR LABX JOURNEY</span><strong>{roadmapProgress}%</strong><span>{completedStages.length} of {roadmap.length} stages complete</span></div><div className="roadmap-progress-track"><span style={{width:`${roadmapProgress}%`}}/></div><div className="roadmap-coins"><span>LABX COINS</span><strong>{coinBalance}</strong></div></div>
    <div className="roadmap-timeline">{roadmap.map((stage,i)=>{const complete=completedStages.includes(stage.number);const current=!complete&&(i===0||completedStages.includes(roadmap[i-1].number));return <article className={`roadmap-stage ${complete?'is-complete':''} ${current?'is-current':''}`} key={stage.number}><div className="roadmap-node-wrap"><div className="roadmap-node">{complete?'✓':stage.number}</div>{i<roadmap.length-1&&<div className={`roadmap-connector ${complete?'is-complete':''}`}><span/></div>}</div><div className="roadmap-card"><div className="roadmap-card-top"><div><span className="roadmap-stage-kicker">{complete?'COMPLETED':current?'CURRENT STAGE':`STAGE ${stage.number}`}</span><h3>{stage.title}</h3></div><span className="roadmap-stage-number">{stage.number}</span></div><p>{stage.description}</p><div className="roadmap-card-bottom"><span>{complete?'Momentum unlocked':current?'Ready to move forward':'Coming next'}</span><button className="roadmap-action" onClick={()=>toggleStage(stage.number)}>{complete?'COMPLETED':'COMPLETE +50 COINS'}</button></div></div></article>})}</div>
   </section>
   <section id="leaderboard" className="section"><SectionTitle eyebrow="08 / LEADERBOARD" title="Community momentum.">Recognition based on building, contributing, connecting and helping others move forward.</SectionTitle><div className="result-line">TOP CONTRIBUTORS · YOUR BALANCE {coinBalance} COINS</div><div className="project-list">{personalizedLeaderboard.map((user,i)=><article className="project-row" key={user.name}><span className="index">{String(i+1).padStart(2,'0')}</span><div><small>{user.role}</small><h3>{user.name}{user.name===currentUserName?' · YOU':''}</h3><p>{user.projects} PROJECTS · {user.connections} CONNECTIONS · {user.coins} COINS</p></div><div className="row-meta"><span>{user.points} XP</span><b>→</b></div></article>)}</div></section>
   <section id="about" className="section about"><div className="section-intro-grid"><SectionTitle eyebrow="09 / ABOUT LABX" title="An ecosystem designed around momentum.">LabX brings together people with ideas, builders, startups, mentors, and opportunities so progress doesn't stop at the idea stage.</SectionTitle><ThreeSectionVisual variant="about"/></div><div className="about-grid"><div className="about-statement">IDEAS ARE<br/><em>ONLY THE START.</em></div><div className="about-copy"><p>LabX connects the pieces that usually live in separate places.</p><div className="about-points"><span><b>01</b> DISCOVER</span><span><b>02</b> CONNECT</span><span><b>03</b> BUILD</span><span><b>04</b> VALIDATE</span><span><b>05</b> LAUNCH</span><span><b>06</b> GROW</span></div></div></div></section>
   <section className="how"><div className="how-top"><div><div className="how-label">HOW IT WORKS</div><h2>From signal to momentum.</h2><p>Every stage has a purpose. Move through the ecosystem without losing the thread.</p></div><ThreeSectionVisual variant="journey"/></div><div className="journey">{['DISCOVER','CONNECT','BUILD','VALIDATE','LAUNCH','GROW'].map((x,i)=><div className="journey-step" key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}</div></section>
  </main>
  <footer className="labx-footer"><div className="footer-inner"><div className="footer-brand"><div className="footer-logo"><span>Lab</span><strong>X</strong></div><h3>BUILD WHAT MATTERS.</h3><p>Where ideas, people, and opportunities come together. Your work becomes your reputation.</p><div className="footer-socials"><a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.55-3.87-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></a><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85c0-3.76-2.01-5.51-4.7-5.51-2.17 0-3.14 1.2-3.68 2.04V8.5H9.13V21h3.49v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.87 2.02 3.31V21H21v-7.15Z"/></svg></a></div></div><div className="footer-column"><h4>PRODUCT</h4><a href="#about">About LabX</a><a href="#discover">Discover</a><a href="#projects">Projects</a><a href="#startups">Startups</a><a href="#opportunities">Opportunities</a></div><div className="footer-column"><h4>COMMUNITY</h4><a href="#people">People</a><a href="#followers">Followers</a><a href="#mentors">Mentors</a><a href="#leaderboard">Leaderboard</a><a href="#roadmap">Roadmap</a></div><div className="footer-column"><h4>INNOVATION HUB</h4><a href="#projects">Build</a><a href="#startups">Launch</a><a href="#mentors">Connect</a><a href="#opportunities">Grow</a><a href="#about">About LabX</a></div></div><div className="footer-bottom"><span>© 2026 ZeAI LabX. All rights reserved.</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div><span className="footer-powered">Built with purpose. Powered by community.</span></div></footer>
 </div>
}
export default App;
