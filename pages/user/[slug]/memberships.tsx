import UserBillingDetail from "components/containers/User/UserBillingDetail";
import { useCyfrUserContext } from "components/context/CyfrUserProvider";
import MainLayout from "components/layouts/MainLayout";

const UserMembershipPage = () => {
  const {cyfrUser} = useCyfrUserContext()

  return (
  <MainLayout sectionTitle="Memberships" subTitle={cyfrUser?.name || ""}>
    <div className="flex flex-col space-y-4">
      {cyfrUser && 
        <UserBillingDetail />
      }
        
        <div className="relative">
            <h2>Memberships</h2>
            <p>Actually it should be communes, but whateves. Do that here.</p>
        </div>
    </div>
  </MainLayout>
)};

export default UserMembershipPage;
