const generateCredential = async (userId, timestamp) => {
  let string = ``;
  const dataToEncrypt = `${userId}:${timestamp}`;
  const encoder = new TextEncoder();
  const key = encoder.encode(process.env.SECRET_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    true,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(dataToEncrypt)
  );
  string = await btoa(String.fromCharCode(...new Uint8Array(signature)));
  console.log("credential", string);
  return string;
};

const verifyCredential = async(credential, userId, timestamp) => {
  const expectedCredential = await generateCredential(userId, timestamp);
  return expectedCredential === credential;
}

export { generateCredential, verifyCredential };