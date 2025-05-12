import { IpContext } from "./IpContext";
import PropTypes from "prop-types";

const IpProvider = ({ children }) => {
  const ip = "http://192.168.254.108:8081";
  return <IpContext.Provider value={ip}>{children}</IpContext.Provider>;
};

export default IpProvider;

IpProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
