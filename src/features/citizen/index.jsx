import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";

import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className="inline-block float-right">
      <button className="btn px-6 btn-sm normal-case btn-primary">
        Add New
      </button>
    </div>
  );
};

function Leads() {
  const dispatch = useDispatch();

  return (
    <>
      <TitleCard
        title="Citizens"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>National Id</th>
                <th>Phone number</th>
                <th>Government</th>
                <th>Gender</th>
                <th>Age</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-bold">omar </div>
                      <div className="text-sm opacity-50">Khaled</div>
                    </div>
                  </div>
                </td>
                <td>20212030400298</td>
                <td>01002020455</td>
                <td>Suez </td>
                <td>Male</td>
                <td>21</td>
                <td>
                  <button className="btn btn-square btn-ghost">
                    <PencilIcon className="w-5" />
                  </button>
                  <button className="btn btn-square btn-ghost">
                    <TrashIcon className="w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Leads;
