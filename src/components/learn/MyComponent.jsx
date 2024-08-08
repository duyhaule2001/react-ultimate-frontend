import "./style.css"
const MyComponent = () => {
    // const hoidanit =null;
    const hoidanit = [1, 2, 3]
    // const hoidanit = {
    //     name: "hoidanit",
    //     age: 25
    // }
    return (
      <>
        <div>le duy hau {JSON.stringify(hoidanit)} in japan</div>
        <div className="child"
        style={{borderRadius: "10px"}}
        >abcd</div>
      </>
    );
  }

  export default MyComponent;