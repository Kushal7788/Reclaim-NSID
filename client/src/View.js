import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";


export const View = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    let { nsid } = useParams();
    const [proofData, setProofData] = useState(null);
    const [isVerified, setIsVerified] = useState(null);
    const navigate = useNavigate();

    const checkNSID = async () => {
        try {
            const resp = await fetch(`${apiUrl}/check/${nsid}`);
            if (resp.status === 401) {
                setIsVerified(false);
            }
            else if (resp.status === 200) {
                setIsVerified(true);
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${apiUrl}/fetch/${nsid}`);
            const data = await res.json();
            setProofData(data.data);
            console.log(proofData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleGoBack = () => {
        navigate(`/`);
    }

    useEffect(() => {
        checkNSID();
    }, []);

    useEffect(() => {
        if (isVerified === true) {
            fetchProfile();
        }
    }, [isVerified]);


    return (
        <div className="">
            <Toaster />
            <header class="text-gray-600 body-font border ">
                <div class="container mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center">
                    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <img
                            src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
                            class="w-10 h-10 rounded-full"
                        />

                        <span class="ml-3 font-bold text-xl">NS.ID</span>
                    </a>
                    <a href="https://www.reclaimprotocol.org/">
                        <button class="inline-flex cursor-pointer items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                            🔗 Reclaim Protocol
                        </button>
                    </a>
                </div>
            </header>

            <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto">
                    {isVerified === false && (
                        <>
                            <div class="flex flex-col text-center w-full mb-12">
                                <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                    Invalid NS.ID. Please check again.
                                </h1>
                            </div>
                        </>
                    )}
                    {isVerified === true && proofData !== null && (
                        <>
                            <div class="flex flex-col text-center w-full mb-12">
                                <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                    Proofs for {nsid} NS.ID
                                </h1>
                            </div>
                            <div className="flex flex-col justify-center items-center gap-4 text-center w-full mt-12">
                                {proofData.proofs.map((proof) => (
                                    <div className="flex flex-col justify-center items-center gap-4 text-center w-full mt-12">
                                        <h1 className="text-2xl font-medium title-font">Provider: {proof.provider}</h1>
                                        <p>
                                            <span className="font-bold">Claim Id:</span> {proof.templateClaimId}
                                        </p>
                                        <p>
                                            <span className="font-bold">Parameters:</span> {proof.parameters}
                                        </p>
                                        <p>
                                            <span className="font-bold">Owner Public Key:</span> {proof.ownerPublicKey}
                                        </p>
                                        <p>
                                            <span className="font-bold">Timestamp:</span> {proof.timestampS}
                                        </p>
                                        <p>
                                            <span className="font-bold">Witness Addresses:</span> {proof.witnessAddresses}
                                        </p>
                                        <p>
                                            <span className="font-bold">Signatures:</span> {proof.signatures}
                                        </p>
                                        <p>
                                            <span className="font-bold">Redacted Parameters:</span> {proof.redactedParameters}
                                        </p>
                                        <p>
                                            <span className="font-bold">Context:</span> {proof.context}
                                        </p>
                                        <p>
                                            <span className="font-bold">Epoch:</span> {proof.epoch}
                                        </p>
                                        <p>
                                            <span className="font-bold">Identifier:</span> {proof.identifier}
                                        </p>
                                        <p>
                                            <span className="font-bold">---------------------------------</span>
                                        </p>
                                    </div>
                                ))}
                                <button
                                    onClick={handleGoBack}
                                    class="text-black sm:h-[60px] bg-gray-100 border-0 py-2 px-8 focus:outline-none hover:bg-gray-200 rounded-lg text-xl mx-2"
                                >
                                    Home
                                </button>
                            </div>

                        </>
                    )}
                </div>
            </section >
            <footer class="text-gray-600  body-font">
                <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                    <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
                        <img
                            class="w-10 h-10 rounded-full"
                            src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
                        />
                        <span class="ml-3 text-xl">Powered by Reclaim</span>
                    </a>
                    <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                        NS.ID
                    </p>
                    <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                        <a
                            href="https://twitter.com/protocolreclaim"
                            class="ml-3 text-gray-500"
                        >
                            <svg
                                fill="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </a>
                    </span>
                </div>
            </footer>
        </div >
    );
};