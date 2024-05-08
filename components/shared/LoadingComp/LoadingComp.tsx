import classes from  "./LoadingComp.module.css";


const LoadingComp = ({asOverlay=true}:{asOverlay?:boolean})=>{
    return (
        <div className={`${asOverlay && classes['loading-spinner__overlay']}`}>
      <div className={classes["lds-dual-ring"]}></div>
    </div>
    )
};

export default LoadingComp;