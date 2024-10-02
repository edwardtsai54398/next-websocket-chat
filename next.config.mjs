/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
  ],
  // issue: https://github.com/ant-design/ant-design/issues/46053#issuecomment-1827836587
};

export default nextConfig;
