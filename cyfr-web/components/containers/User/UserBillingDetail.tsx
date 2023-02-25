const UserBillingDetail = () => {
  return (
    <div className="lg:flex items-center justify-between my-6 p-4 rounded-lg bg-base-200">
      <div className="lg:w-1/2 w-full">
        <p className="text-base leading-4 text-base-content text-opacity-70">
          Choose your plan
        </p>
        <h1
          role="heading"
          className="md:text-5xl text-3xl font-bold leading-10 mt-3 text-base-content "
        >
          Our pricing plan
        </h1>
        <p
          role="contentinfo"
          className="text-base leading-5 mt-5 text-base-content text-opacity-70"
        >
          We’re working on a suit of tools to make managing complex systems
          easier, for everyone for free. we can’t wait to hear what you think
        </p>
        <div className="w-56">
          <button className="bg-base-100 shadow rounded-full flex items-center mt-10 rounded-full">
            <div
              className="bg-base-100 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none text-base leading-none text-base-content text-opacity-70 rounded-full py-4 px-6 mr-1"
              id="monthly"
            >
              Monthly
            </div>
            <div
              className="bg-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none text-base leading-none text-white rounded-full py-4 px-6"
              id="annually"
            >
              Annually
            </div>
          </button>
        </div>
      </div>
      <div
        className="xl:w-1/2 lg:w-7/12 relative w-full lg:mt-0 mt-12 md:px-8"
        role="list"
      >
        <div
          role="listitem"
          className="bg-base-100 cursor-pointer shadow rounded-lg p-8 relative "
        >
          <div className="md:flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-6 text-base-content ">
              Free Tier
            </h2>
            <p className="text-2xl font-semibold md:mt-0 mt-4 leading-6 text-base-content ">
              $0
            </p>
          </div>
          <p className="md:w-80 text-base leading-6 mt-4 text-base-content text-opacity-70">
            You can do pretty much everything
          </p>
        </div>
        <div
          role="listitem"
          className="bg-base-100 cursor-pointer shadow rounded-lg mt-3 flex relative"
        >
          <div className="w-full p-8">
            <div className="md:flex items-center justify-between">
              <h2 className="text-2xl font-semibold leading-6 text-base-content ">
                Author
              </h2>
              <p className="text-2xl md:mt-0 mt-4 font-semibold leading-6 text-base-content ">
                $5<span className="font-normal text-base">/mo</span>
              </p>
            </div>
            <p className="md:w-80 text-base leading-6 mt-4 text-base-content text-opacity-70">
              Bonus features to help promote your work
            </p>
          </div>
        </div>
        <div
          role="listitem"
          className="bg-base-100 cursor-pointer shadow rounded-lg p-8 relative  mt-7"
        >
          <div className="md:flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-6 text-base-content ">
              Agent
            </h2>
            <p className="text-2xl md:mt-0 mt-4 font-semibold leading-6 text-base-content ">
              $5<span className="font-normal text-base">/mo</span>
            </p>
          </div>
          <p className="md:w-80 text-base leading-6 mt-4 text-base-content text-opacity-70">
            Find talent
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserBillingDetail;
