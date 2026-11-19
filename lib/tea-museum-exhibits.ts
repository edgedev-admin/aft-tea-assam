import { storyPhotos } from "./photographic-stories.ts";

export const museumPhotographs=["garden-path","fresh-leaf","factory-machinery"].map(id=>{
  const photo=storyPhotos.find(item=>item.id===id);
  if(!photo||photo.publicationApproval!=="not-applicable")throw new Error(`Museum image needs publication approval: ${id}`);
  return {id:photo.id,src:photo.src,alt:photo.alt,width:photo.width,height:photo.height,sourceFile:photo.sourceFile};
});
export const pavilionAssets={
  desktop:{src:"/3d/pavilion/pavilion-desktop.webp",width:1586,height:992},
  mobile:{src:"/3d/pavilion/pavilion-mobile.webp",width:768,height:1228},
} as const;
// One continuous fixed-view pavilion; only local accent illumination varies.
export const museumGalleries:Record<string,{wash:string;accent:string}>={
  "ajanta-gold":{wash:"#ffe0ae",accent:"#aa884e"},
  "ajanta-elaichi":{wash:"#c9e5bd",accent:"#708c52"},
  "ajanta-high-societea":{wash:"#e2ccb2",accent:"#9c7a53"},
  "ajanta-kolkata-street-masala-chai":{wash:"#efc2a6",accent:"#a35d44"},
};
