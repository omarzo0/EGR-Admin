import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Citizen from "../../features/citizen";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "citizen" }));
  }, []);

  return <Citizen />;
}

export default InternalPage;
