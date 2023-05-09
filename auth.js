/** @type {() => import("express").RequestHandler} */
export const authMiddlware = () => {
  const sessionStore = {};
  return (req, res, next) => {
    
    
    next();
  };
};


/** @type {() => import("express").RequestHandler} */
export const apiAuthMiddlware = () => {
    return (req, res, next) => {
      
      
      next();
    };
  };
  