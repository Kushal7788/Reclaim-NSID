import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
import {
  Card, CardHeader, CardBody, Collapse,
  VStack, Heading, Text, Box, Button,
  Stack, StackDivider, Badge, IconButton, Flex
} from '@chakra-ui/react'

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("create");
  const [NSID, setNSID] = useState("");
  const [verifiedNSID, setVerifiedNSID] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleUpdateSwitch = (event) => {
    setSelectedTab('update');
  };

  const handleCreateSwitch = () => {
    setSelectedTab('create');
  };

  const handleViewSwitch = () => {
    setSelectedTab('view');
  };

  const handleNSIDChange = (event) => {
    setNSID(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleUpdateClick = async () => {
    try {
      const resp = await fetch(`${apiUrl}/check/${NSID}`);
      const data = await resp.json();
      if (resp.status === 401) {
        toast.error(data.message);
      }
      else if (resp.status === 200) {
        toast.success(data.message);
        setVerifiedNSID(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleViewClick = async () => {
    try {
      const resp = await fetch(`${apiUrl}/check/${NSID}`);
      const data = await resp.json();
      if (resp.status === 401) {
        toast.error(data.message);
      }
      else if (resp.status === 200) {
        toast.success(data.message);
        setViewProfile(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  const handleCreateClick = async () => {
    try {
      setIsLoading(true);
      if(!NSID){
        // toast.error("Please enter a valid NSID");
        setIsLoading(false);
        return;
      }
      const resp = await fetch(`${apiUrl}/create/${NSID}`);
      const data = await resp.json();
      if (resp.status === 401) {
        toast.error(data.message);
        setIsLoading(false);
      }
      else if (resp.status === 200) {
        toast.success(data.message);
        setVerifiedNSID(true);
        setIsLoading(false);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (verifiedNSID) {
      navigate(`/add-proof/${NSID}`);
    }
  }, [verifiedNSID]);

  useEffect(() => {
    if (viewProfile) {
      navigate(`/view/${NSID}`);
    }
  }, [viewProfile]);


  return (
    <>
      <ChakraProvider>
        <body class="h-full w-full">
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-4">
              <Toaster />
              <header class="text-gray-600 body-font">
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
                <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                  <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">

                    <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                      Create a Psuedonymous Profile <br class="hidden lg:inline-block" />
                    </h1>

                    {/* </div> */}
                    <div class="flex w-full sm:flex-row flex-col my-6 mx-auto sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-center sm:items-end">
                      <form onSubmit={handleSubmit}>
                        <div class="flex-grow w-full h-full block">
                          <div class="relative flex-grow w-full h-full my-2">
                            <label for="provider" class="block mb-2 text-xl font-medium ">
                              Pick a psuodonym you resonate with
                            </label>
                            <input type="text" required placeholder="Enter the NS.ID" onChange={handleNSIDChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-xl py-3  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:h-[50px] p-2.5 " />
                          </div>
                        </div>
                        <div class="flex-grow w-full h-full block mb-2">
                          <Button type="submit" isLoading={isLoading} size={'lg'} colorScheme="purple" variant='solid' onClick={handleCreateClick} >
                            Submit
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img
                      class="object-cover object-center rounded"
                      alt="hero"
                      src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
                    />
                  </div>
                </div>
              </section>
              </main>

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
                    Network State ID
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
              </div>
            </body>
          </ChakraProvider>
        </>
        );
}

        export default App;
