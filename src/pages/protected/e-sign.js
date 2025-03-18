import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Esign from "../../features/e-sign";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "e-sign" }));
  }, []);

  return <Esign />;
}

export default InternalPage;
