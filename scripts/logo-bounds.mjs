import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const paths = [
  "M10688.5 15071.39l-677.57 345.71 104.95 -753.27c250.41,34.57 461.91,191 572.62,407.56z",
  "M12312.96 14850c0,1001.27 -811.69,1812.96 -1812.96,1812.96 -759.22,0 -1409.42,-466.69 -1679.42,-1128.84 -4.5,-11.02 -8.88,-22.09 -13.16,-33.22 -9.98,-22.32 -22.55,-42.26 -43.12,-54.81 -28.48,-17.38 -72.28,-20.61 -117.07,-22.93l-476.58 -23.98 -10.94 -0.55c-45.74,-2.21 -89.62,-3.11 -108.23,13.61 -20.09,18.06 -10.73,56.66 -1.37,95.26 289.63,1081.9 1276.63,1878.65 2449.89,1878.65 1400.68,0 2536.15,-1135.47 2536.15,-2536.15 0,-743.53 -319.98,-1412.33 -829.73,-1876.22l186.4 -261.63c26.74,-37.54 17.9,-90.11 -19.63,-116.86l-466.88 -332.62c-37.53,-26.74 -90.13,-17.9 -116.86,19.63l-197.97 277.88c-330.59,-157.87 -700.69,-246.33 -1091.48,-246.33 -1226.63,0 -2249.71,870.88 -2485.04,2028.03 -8.49,49.16 -16.98,98.31 9.79,124.45 24.85,24.27 80.1,28.71 137.52,31.71l414.66 20.86 8.33 0.42c43.51,2.11 86.05,2.97 112.51,-17.14 17.49,-13.3 27.95,-35.75 35.75,-61.68 3.87,-16.74 7.97,-33.4 12.29,-49.96 203.42,-778.77 911.67,-1353.5 1754.19,-1353.5 233.9,0 457.46,44.29 662.73,124.95l-1008.79 1416c260.41,44.06 480.6,206.37 603.38,429.81l1025.28 -1439.12c327.7,328.03 530.36,781.01 530.36,1281.32z"
];
const pts = [];
const add = (x,y) => pts.push([x,y]);
const sampleCubic = (p0,p1,p2,p3) => {
  for (let i=0;i<=40;i++){const t=i/40,mt=1-t;add(mt**3*p0[0]+3*mt**2*t*p1[0]+3*mt*t**2*p2[0]+t**3*p3[0],mt**3*p0[1]+3*mt**2*t*p1[1]+3*mt*t**2*p2[1]+t**3*p3[1]);}
};
function parsePath(d){
  let x=0,y=0,sx=0,sy=0;
  const re=/([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g; let m;
  while((m=re.exec(d))){
    const cmd=m[1], args=m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if(cmd==="M"){for(let i=0;i<args.length;i+=2){x=args[i];y=args[i+1];sx=x;sy=y;add(x,y);}}
    else if(cmd==="m"){for(let i=0;i<args.length;i+=2){x+=args[i];y+=args[i+1];if(i===0){sx=x;sy=y;}add(x,y);}}
    else if(cmd==="L"){for(let i=0;i<args.length;i+=2){x=args[i];y=args[i+1];add(x,y);}}
    else if(cmd==="l"){for(let i=0;i<args.length;i+=2){x+=args[i];y+=args[i+1];add(x,y);}}
    else if(cmd==="C"){for(let i=0;i<args.length;i+=6){sampleCubic([x,y],[args[i],args[i+1]],[args[i+2],args[i+3]],[args[i+4],args[i+5]]);x=args[i+4];y=args[i+5];}}
    else if(cmd==="c"){for(let i=0;i<args.length;i+=6){const p0=[x,y],p1=[x+args[i],y+args[i+1]],p2=[x+args[i+2],y+args[i+3]],p3=[x+args[i+4],y+args[i+5]];sampleCubic(p0,p1,p2,p3);x=p3[0];y=p3[1];}}
    else if(cmd==="z"||cmd==="Z"){x=sx;y=sy;}
  }
}
for(const p of paths)parsePath(p);
const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
const b={minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};
const padX=90, padTop=130, padBottom=35;
const vb=[Math.floor(b.minX-padX),Math.floor(b.minY-padTop),Math.ceil(b.maxX-b.minX+padX*2),Math.ceil(b.maxY-b.minY+padTop+padBottom)];
console.log(JSON.stringify(b));
console.log(vb.join(" "));
const out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" fill="none">\n`+paths.map(p=>`  <path fill="#A9ABAE" d="${p}"/>`).join("\n")+`\n</svg>\n`;
fs.writeFileSync(path.join(root, "public", "assets", "logo.svg"), out);
fs.writeFileSync(path.join(root, "Assets", "Logo Sem Talento.svg"), out);
