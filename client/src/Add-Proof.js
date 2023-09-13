import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import Select from 'react-select';
import { ChakraProvider } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
import {
    Card, CardHeader, CardBody, Collapse,
    VStack, Heading, Text, Box, Button, Link,
    Stack, StackDivider, Badge, IconButton, Flex,
    Progress
} from '@chakra-ui/react'

// import AppStore from './assets/AppStore.svg';
// import PlayStore from './assets/PlayStore.svg';

// export const AddProof = () => {
//     const callBackUrl = process.env.REACT_APP_API_URL + '/proofs';
//     console.log(callBackUrl);
//     return (
//         <ChakraProvider>
//             <Flex alignItems='center' justifyContent='center' w='100%' h='100vh'>
//                 <ImportReclaimProofs label='Import from Reclaim' webHook={callBackUrl} isProofsReceived={true} />
//             </Flex>
//         </ChakraProvider>
//     );
// }

export const AddProof = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    let { nsid } = useParams();
    const [claimUrl, setClaimUrl] = useState(null);
    const [checkId, setCheckId] = useState(null);
    const [selectProvider, setSelectProvider] = useState([]);
    const [gotValidProof, setGotValidProof] = useState(false);
    const intervalRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [hideSubmit, setHideSubmit] = useState(false);

    const options = [
        { value: 'uidai-aadhar', label: 'Aadhaar Name' },
        { value: 'uidai-address', label: 'Aadhaar Address' },
        { value: 'uidai-dob', label: 'Aadhaar DOB' },
        { value: 'uidai-phone', label: 'Aadhaar Phone' },
        { value: 'uidai-state', label: 'Aadhaar State' },
        { value: 'uidai-uid', label: 'Aadhaar No' },
        { value: 'bybit-balance', label: 'Bybit Balance' },
        { value: 'bybit-spot-pnl', label: 'Bybit Spot PNL' },
        { value: 'chess-rating', label: 'Chess Rating' },
        { value: 'chess-user', label: 'Chess User' },
        { value: 'coinswitch-balance', label: 'Coinswitch Balance' },
        { value: 'codeforces-rating', label: 'Codeforces Rating' },
        { value: 'dunzo-last-order', label: 'Dunzo Last Order' },
        { value: 'facebook-friends-count', label: 'Facebook Friends Count' },
        { value: 'flickr-user', label: 'Flickr User' },
        { value: 'github-commits', label: 'Github Commits' },
        { value: 'github-issues', label: 'Github Issues' },
        { value: 'github-pull-requests', label: 'Github Pull Requests' },
        { value: 'google-login', label: 'GMail' },
        { value: 'godaddy-login', label: 'GoDaddy Login' },
        { value: 'hackerearth-user', label: 'Hackerearth User' },
        { value: 'hackerrank-username', label: 'Hackerrank Username' },
        { value: 'instagram-user', label: 'Instagram User' },
        { value: 'instagram-user-week-posts', label: 'Instagram User Week Posts' },
        { value: 'irs-address', label: 'IRS Address' },
        { value: 'irs-name', label: 'IRS Name' },
        { value: 'letterboxd-user', label: 'Letterboxd User' },
        { value: 'lichess-username', label: 'Lichess Username' },
        { value: 'loom-user-id', label: 'Loom User ID' },
        { value: 'medium-followers-count', label: 'Medium Followers Count' },
        { value: 'notion-username', label: 'Notion Username' },
        { value: 'outlook-login', label: 'Outlook Mail' },
        { value: 'spotify-account-type', label: 'Spotify Account Type' },
        { value: 'spotify-email', label: 'Spotify Email' },
        { value: 'spotify-premium', label: 'Spotify Premium' },
        { value: 'swiggy-total-count', label: 'Swiggy Total Order' },
        { value: 'tinder-match-count', label: 'Tinder Match Count' },
        { value: 'wikipedia-user', label: 'Wikipedia User' },
        { value: 'zoho-email', label: 'Zoho Email' },
    ];


    const postData = async () => {
        try {
            setIsLoading(true);
            if(selectProvider.length === 0)
            {
                // toast.error("Please select atleast one credential!");
                setIsLoading(false);
                return;
            }
            setGotValidProof(false);
            let url = `${apiUrl}/reclaim-url`;

            let options = {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Sec-Fetch-Mode": "cors",
                },
                body: JSON.stringify({
                    provider: selectProvider,
                    nsId: nsid,
                }),
            };
            const res = await fetch(url, options);
            const data = await res.json();
            setCheckId(data.checkId);
            setClaimUrl(data.url);
            setIsLoading(false);
            setHideSubmit(true);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-check/${checkId}`);
            const data = await response.json();
            if (data.data?.proofs) {
                toast.success("Proof Added to your profile!");
                navigate(`/view/${nsid}`);
            }
        } catch (err) {
            console.log(`error in fetchData: ${err}`);
        }
    };

    const handleProviderOptionChange = async (selected) => {
        setSelectProvider(selected);
        console.log(`Option selected:`, selected);
    };

    const handleGoBack = () => {
        navigate(`/`);
    }

    const handleGoProfile = () => {
        navigate(`/view/${nsid}`);
    }

    const handleCopyLink = async (link) => {
        try {
            await navigator.clipboard.writeText(link);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy link:", error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3182ce' : 'white',
            color: state.isSelected ? 'white' : 'black',
            // width: '100px',
            // height: '100px',
        }),
    };


    useEffect(() => {
        if (checkId) {
            intervalRef.current = setInterval(() => {
                fetchData();
            }, 7000);
            return () => clearInterval(intervalRef.current);
        }
    }, [checkId]);

    useEffect(() => {
        if (gotValidProof === true) {
            clearInterval(intervalRef.current);
        }
    }, [gotValidProof]);

    return (
        <ChakraProvider>
            <div className="">
                <Toaster />
                <header class="text-gray-600 body-font border ">
                    <div class="container mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center">
                        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                            <img
                                src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
                                class="w-10 h-10 rounded-full"
                            />

                            <span class="ml-3 font-bold text-xl">Network State ID</span>
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
                        <div class="flex flex-col text-center w-full mb-12">
                            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                Verified By Default
                            </h1>
                            {gotValidProof === true && (
                                <>
                                    <p class="sm:text-2xl text-xl font-medium title-font mb-4 text-gray-900">
                                        Credentials Added to your profile!
                                    </p>
                                </>
                            )}
                        </div>
                        <div class="flex lg:w-2/3 w-full sm:flex-row mx-auto px-4 justify-center  sm:space-x-2 sm:space-y-0 space-y-2 sm:px-0 items-center sm:items-end">
                            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 space-x-2 bgcolor='blue'">
                                <div class="relative flex-grow w-full h-full">
                                    <label for="countries" class="block mb-2 text-xl font-medium ">
                                        Attach Credentials to your Psuedonymous Profile
                                    </label>
                                    <Select
                                        isDisabled={hideSubmit}
                                        isMulti
                                        options={options}
                                        styles={customStyles}
                                        onChange={handleProviderOptionChange}
                                        placeholder="Select options..."
                                        required
                                        maxMenuHeight={'300px'}
                                    />
                                </div>
                                <Button type="submit" hidden={hideSubmit} isLoading={isLoading} size={'lg'} colorScheme="purple" variant='solid' onClick={postData} >
                                    Submit
                                </Button>
                            </form>
                            {gotValidProof === true && (
                                <>
                                    <button
                                        onClick={handleGoProfile}
                                        class="text-white sm:h-[60px] bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded-lg text-xl"
                                    >
                                        Profile
                                    </button>
                                </>
                            )}

                        </div>
                        <div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 justify-center  sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-center sm:items-end">
                            {claimUrl !== null && (
                                <div className="flex flex-col justify-center items-center gap-4 text-center w-full mt-12">
                                    <p class="sm:text-3xl hidden md:block text-2xl font-medium title-font mb-4 text-gray-900">
                                        Scan in Reclaim App
                                    </p>
                                    <QRCodeSVG className="hidden md:block" height={200} width={200} value={claimUrl} />
                                    <div className="flex-row p-5 rounded-lg  gap-4">
                                        <div className="mb-7">
                                            <p class="sm:text-sm text-sm font-medium title-font justify-centre mb-1 text-gray-900">
                                                Waiting for Proof .... </p>
                                            <Progress size='xs' isIndeterminate />
                                        </div>
                                        <a target="_blank" href={claimUrl}>
                                            <button class="text-white w-full bg-indigo-500 border-0 py-2 px-6 focus:outline-none m-2 hover:bg-indigo-600 rounded-xl text-lg">
                                                Tap to Create Proof
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="mx-auto md:pt-16">
                            <p class="text-blue-400 font-bold pb-8 lg:pb-6 text-center">
                                Download our app:
                            </p>
                            {/* <Flex
                                alignItems="center"
                                justifyContent="center"
                            > */}
                            <Flex alignItems="center" justifyContent="center" gap={4}>
                                <Link href="https://apps.apple.com/in/app/reclaim-wallet/id6447378796" isExternal>
                                    <Box
                                        as="img"
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                        alt="App Store"
                                        width="150px" // Set the width as needed
                                    />
                                </Link>
                                <Link href="https://play.google.com/store/apps/details?id=com.credentialswallet&pcampaignid=web_share" isExternal>
                                    <Box
                                        as="img"
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                        alt="Play Store"
                                        width="150px" // Set the width as needed
                                    />
                                </Link>
                            </Flex>
                            {/* </Flex> */}
                        </div>
                    </div>
                </section >

            </div >
        </ChakraProvider>
    );
};