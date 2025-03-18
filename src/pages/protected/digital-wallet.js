import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DigitalWallet from "../../features/digital-wallet";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "digitalWallet" }));
  }, []);

  return <DigitalWallet />;
}

export default InternalPage;
