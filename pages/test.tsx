import { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import useDebug from "../hooks/useDebug";

const { debug, info, fileMethod } = useDebug("test", "DEBUG");

const Test = ({}) => {

  const w = 600
  const steps = ['Bio', 'Appearance', 'Backstory', 'Thumbnail', 'Done']
  const [currentStep, setCurrentStep] = useState(0)
  const getLeeft = steps.map((s,i) => { return i === 0 ? `left-0` : `-left-[${(i*w)}px]`})[currentStep]

  return (
    <AdminLayout sectionTitle="InlineTextArea">
      <div>
        <ul className="steps steps-vertical lg:steps-horizontal bg-base-100">
          {steps.map((step, idx) => (
            <li
              className={`cursor-pointer hover:step-success step ${
                currentStep >= idx ? "step-secondary" : ""
              }`}
              onClick={() => setCurrentStep(idx)}
              key={step + idx}
            >
              {step}
            </li>
          ))}
        </ul>
        <div className={`relative h-[150px] min-w-[${w}px] border border-primary overflow-x-hidden scrollbar-hide`}>
          <div className={`flex min-h-[150px] transition-all duration-200 absolute border border-secondary ${getLeeft}`}>
            {steps.map((step,idx) => (
              <div className={`flex-col-1 w-[${w}px]`}>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between max-w-full">
          <button
            disabled={currentStep < 1}
            className="btn btn-sm btn-primary"
            onClick={() => setCurrentStep((c) => c - 1)}
          >
            &lt;
          </button>
          <button
            disabled={currentStep >= steps.length - 1}
            className="btn btn-sm btn-primary"
            onClick={() => setCurrentStep((c) => c + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Test;
