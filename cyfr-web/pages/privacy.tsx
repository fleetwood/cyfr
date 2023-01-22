import { useContext } from "react";
import CreatePost from "../components/containers/Post/CreatePost";
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem";
import { ToastContext } from "../components/context/ToastContextProvider";
import MainLayout from "../components/layouts/MainLayout";
import { CyfrLogo } from "../components/ui/icons";
import usePostsApi from "../hooks/usePostsApi";

const Home = () => {
  return (
    <MainLayout sectionTitle="Privacy Policy" subTitle="The Creative Site">
      <p>
        We think privacy is important. Economists (and pundits) began reporting
        back in 2014 that{" "}
        <a href="https://www.wired.com/insights/2014/07/data-new-oil-digital-economy/">
          data passed oil
        </a>{" "}
        as the most valuable commodity on the planet.
      </p>

      <p>
        Unlike{" "}
        <a href="https://www.forbes.com/sites/forbestechcouncil/2019/11/15/data-is-the-new-oil-and-thats-a-good-thing/?sh=5ac7010f7304">
          Forbes
        </a>
        , we don't think that's a good thing.
      </p>

      <p>We will always do our best to keep your information private.</p>

      <div>
        <p>
          <strong>
            Transparency and informing the public about how their data are being
            used are two basic goals of the GDPR. This article explains what is
            a privacy notice and offers a privacy notice template to help you
            comply with the law.
          </strong>
        </p>
        <p>
          The EU General Data Protection Regulation (GDPR) is a first step
          toward giving EU citizens and residents more control over how their
          data are used by organizations. If your company handles the personal
          information of people in the EU, then you must comply with the GDPR,
          no matter where you are in the world. The fines for violating people’s
          new privacy rights can be up to 4 percent of your global revenue or
          €20 million, whichever is higher.
        </p>
        <hr />
        <h3>Our Company Privacy Policy</h3>
        <p>
          Our Company is part of the Our Company Group which includes Our
          Company International and Our Company Direct. This privacy policy will
          explain how our organization uses the personal data we collect from
          you when you use our website.
        </p>
        <p>Topics:</p>
        <ul>
          <li>What data do we collect?</li>
          <li>How do we collect your data?</li>
          <li>How will we use your data?</li>
          <li>How do we store your data?</li>
          <li>Marketing</li>
          <li>What are your data protection rights?</li>
          <li>What are cookies?</li>
          <li>How do we use cookies?</li>
          <li>What types of cookies do we use?</li>
          <li>How to manage your cookies</li>
          <li>Privacy policies of other websites</li>
          <li>Changes to our privacy policy</li>
          <li>How to contact us</li>
          <li>How to contact the appropriate authorities</li>
        </ul>
        <h3>What data do we collect?</h3>
        <p>Our Company collects the following data:</p>
        <ul>
          <li>
            Personal identification information (Name, email address, phone
            number, etc.)
          </li>
          <li>[Add any other data your company collects]</li>
        </ul>
        <h3>How do we collect your data?</h3>
        <p>
          You directly provide Our Company with most of the data we collect. We
          collect data and process data when you:
        </p>
        <ul>
          <li>
            Register online or place an order for any of our products or
            services.
          </li>
          <li>
            Voluntarily complete a customer survey or provide feedback on any of
            our message boards or via email.
          </li>
          <li>Use or view our website via your browser’s cookies.</li>
          <li>[Add any other ways your company collects data]</li>
        </ul>
        <p>
          Our Company may also receive your data indirectly from the following
          sources:
        </p>
        <ul>
          <li>[Add any indirect source of data your company has]</li>
        </ul>
        <h3>How will we use your data?</h3>
        <p>Our Company collects your data so that we can:</p>
        <ul>
          <li>Process your order and manage your account.</li>
          <li>
            Email you with special offers on other products and services we
            think you might like.
          </li>
          <li>[Add how else your company uses data]</li>
        </ul>
        <p>
          If you agree, Our Company will share your data with our partner
          companies so that they may offer you their products and services.
        </p>
        <ul>
          <li>[List organizations that will receive data]</li>
        </ul>
        <p>
          When Our Company processes your order, it may send your data to, and
          also use the resulting information from, credit reference agencies to
          prevent fraudulent purchases.
        </p>
        <h3>How do we store your data?</h3>
        <p>
          Our Company securely stores your data at [enter the location and
          describe security precautions taken].
        </p>
        <p>
          Our Company will keep your [enter type of data] for [enter time
          period]. Once this time period has expired, we will delete your data
          by [enter how you delete users’ data].
        </p>
        <h3>Marketing</h3>
        <p>
          Our Company would like to send you information about products and
          services of ours that we think you might like, as well as those of our
          partner companies.
        </p>
        <ul>
          <li>[List organizations that will receive data]</li>
        </ul>
        <p>
          If you have agreed to receive marketing, you may always opt out at a
          later date.
        </p>
        <p>
          You have the right at any time to stop Our Company from contacting you
          for marketing purposes or giving your data to other members of the Our
          Company Group.
        </p>
        <p>
          If you no longer wish to be contacted for marketing purposes, please
          click here.
        </p>
        <h3>What are your data protection rights?</h3>
        <p>
          Our Company would like to make sure you are fully aware of all of your
          data protection rights. Every user is entitled to the following:
        </p>
        <p>
          <strong>The right to access</strong> – You have the right to request
          Our Company for copies of your personal data. We may charge you a
          small fee for this service.
        </p>
        <p>
          <strong>The right to rectification</strong> – You have the right to
          request that Our Company correct any information you believe is
          inaccurate. You also have the right to request Our Company to complete
          the information you believe is incomplete.
        </p>
        <p>
          <strong>The right to erasure</strong> – You have the right to request
          that Our Company erase your personal data, under certain conditions.
        </p>
        <p>
          <strong>The right to restrict processing</strong> – You have the right
          to request that Our Company restrict the processing of your personal
          data, under certain conditions.
        </p>
        <p>
          <strong>The right to object to processing</strong> – You have the
          right to object to Our Company’s processing of your personal data,
          under certain conditions.
        </p>
        <p>
          <strong>The right to data portability</strong> – You have the right to
          request that Our Company transfer the data that we have collected to
          another organization, or directly to you, under certain conditions.
        </p>
        <p>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us at our
          email:
        </p>
        <p>Call us at:</p>
        <p>Or write to us:</p>
        <h3>Cookies</h3>
        <p>
          Cookies are text files placed on your computer to collect standard
          Internet log information and visitor behavior information. When you
          visit our websites, we may collect information from you automatically
          through cookies or similar technology
        </p>
        <p>For further information, visit allaboutcookies.org.</p>
        <h3>How do we use cookies?</h3>
        <p>
          Our Company uses cookies in a range of ways to improve your experience
          on our website, including:
        </p>
        <ul>
          <li>Keeping you signed in</li>
          <li>Understanding how you use our website</li>
          <li>[Add any uses your company has for cookies]</li>
        </ul>
        <h3>What types of cookies do we use?</h3>
        <p>
          There are a number of different types of cookies, however, our website
          uses:
        </p>
        <ul>
          <li>
            Functionality – Our Company uses these cookies so that we recognize
            you on our website and remember your previously selected
            preferences. These could include what language you prefer and
            location you are in. A mix of first-party and third-party cookies
            are used.
          </li>
          <li>
            Advertising – Our Company uses these cookies to collect information
            about your visit to our website, the content you viewed, the links
            you followed and information about your browser, device, and your IP
            address. Our Company sometimes shares some limited aspects of this
            data with third parties for advertising purposes. We may also share
            online data collected through cookies with our advertising partners.
            This means that when you visit another website, you may be shown
            advertising based on your browsing patterns on our website.
          </li>
          <li>[Add any other types of cookies your company uses]</li>
        </ul>

        <h3>How to manage cookies</h3>

        <p>
          You can set your browser not to accept cookies, and the above website
          tells you how to remove cookies from your browser. However, in a few
          cases, some of our website features may not function as a result.
        </p>
        <h3>Privacy policies of other websites</h3>
        <p>
          The Our Company website contains links to other websites. Our privacy
          policy applies only to our website, so if you click on a link to
          another website, you should read their privacy policy.
        </p>
        <h3>Changes to our privacy policy</h3>
        <p>
          Our Company keeps its privacy policy under regular review and places
          any updates on this web page. This privacy policy was last updated on
          9 January 2019.
        </p>
        <h3>How to contact us</h3>
        <p>
          If you have any questions about Our Company’s privacy policy, the data
          we hold on you, or you would like to exercise one of your data
          protection rights, please do not hesitate to contact us.
        </p>
        <p>Email us at:</p>
        <p>Call us:</p>
        <p>Or write to us at:</p>
        <h3>How to contact the appropriate authority</h3>
        <p>
          Should you wish to report a complaint or if you feel that Our Company
          has not addressed your concern in a satisfactory manner, you may
          contact the Information Commissioner’s Office.
        </p>
        <p>Email:</p>
        <p>Address</p>
      </div>
    </MainLayout>
  );
};

export default Home;
