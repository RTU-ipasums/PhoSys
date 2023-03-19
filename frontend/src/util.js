export const scaleBy = 1.05;

export function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
export function newObject(obj){
  let data;
  try{
    data=JSON.parse(JSON.stringify(obj));
  }
  catch(e){
    //console.error("Failed parsing JSON data: ", e);
  }
  return data;
}
export function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export function isTouchEnabled() { 
  return ( 'ontouchstart' in window ) ||  
         ( navigator.maxTouchPoints > 0 ) ||  
         ( navigator.msMaxTouchPoints > 0 ); 
} 