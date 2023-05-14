import { switchNetwork } from '@wagmi/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

import AttestationStationABI from '../../constants/abi.json';
import { AttestationStationAddress } from '../../constants/addresses';
import { PrimaryButton } from '../OPStyledButton';
import { Select } from '../OPStyledSelect';
import { TextInput } from '../OPStyledTextInput';
import { H2 } from '../OPStyledTypography';
import { AttestForm, FormLabel, FormRow } from '../StyledFormComponents';
import Tooltip from '../Tooltip';

const AttestationTypeSelect = styled(Select)`
  color: ${(props) => (props.value === 'default' ? '#8496AE' : 'inherit')};
`;

const FormButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 28px 0px 0px;
  width: 672px;
`;

const HashedKey = styled.textarea`
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 14px;
  margin: 8px 0;
  outline-style: none;
  padding: 9px 12px;
  height: 48px;
  width: 456px;
  resize: none;
`;

const Link = styled.a`
  color: #f01a37;
`;

const FeedbackMessage = styled.span`
  padding: 0px 36px;
`;

const NewAttestation = () => {
  const { chain } = useNetwork();
  const [etherscanBaseLink, setEtherscanBaseLink] = useState('');

  const [attestationType, setAttestationType] = useState('custom');
  const { address } = useAccount();
  const [about, setAbout] = useState(
    document.location.search.replace('?address=', '')
  );
  const [key, setKey] = useState('rating');
  const [hashedKey, setHashedKey] = useState('');
  const [val, setVal] = useState('');
  const [attestation, setAttestation] = useState({
    about,
    key,
    val
  });

  const [isAboutValid, setIsAboutValid] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isValValid, setIsValValid] = useState(false);

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: AttestationStationAddress,
    abi: AttestationStationABI,
    functionName: 'attest',
    args: [[attestation]],
    enabled: Boolean(about) && Boolean(key) && Boolean(val)
  });
  const { data, error, isError, write } = useContractWrite(config);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log('address', address);
    if (address && chain?.id !== '420') {
      try {
        switchNetwork({ chainId: 420 });
      } catch (error) {
        console.error(console.error);
      }
    }
  }, [address, chain]);

  useEffect(() => {
    try {
      // if (chain.name === 'Optimism') {
      //   setEtherscanBaseLink('https://optimistic.etherscan.io/tx/');
      // }
      // if (chain.name === 'Optimism Goerli') {
      setEtherscanBaseLink('https://goerli-optimism.etherscan.io/tx/');
      // }
    } catch (error_) {
      console.error(error_);
    }
  }, [chain]);

  useEffect(() => {
    try {
      let attest;
      if (key.length > 31) {
        attest = {
          about,
          key: hashedKey,
          val: ethers.utils.toUtf8Bytes(val === '' ? '0x' : val)
        };
      } else {
        attest = {
          about,
          key: ethers.utils.formatBytes32String(key === '' ? '0x' : key),
          // val: ethers.utils.toUtf8Bytes(val === '' ? '0x' : val)
          val
        };
      }
      console.log(attest);
      setAttestation(attest);
    } catch (error_) {
      console.error(error_);
    }
    setIsAboutValid(ethers.utils.isAddress(about));
    // todo: make this more robust
    setIsKeyValid(key !== '');
    setIsValValid(val !== '');
  }, [about, key, val]);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  });

  return (
    <>
      <H2>Rate your experience</H2>
      <AttestForm
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <FormRow>
          <FormLabel>Attestation type</FormLabel>
          <AttestationTypeSelect
            value={attestationType}
            onChange={(e) => setAttestationType(e.target.value)}
          >
            <option value="default" hidden>
              Select attestation type
            </option>
            <option value="custom">Custom attestation</option>
            <option value="soon" disabled>
              More schemas coming soon
            </option>
          </AttestationTypeSelect>
        </FormRow>
        {attestationType === 'custom' ? (
          <>
            <FormRow>
              <FormLabel>Ethereum address</FormLabel>
              <TextInput
                type="text"
                placeholder="Who's this attestation about?"
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                valid={isAboutValid}
              />
            </FormRow>

            <FormRow>
              <FormLabel>
                Attestation key&nbsp;
                <Tooltip>
                  <ul>
                    <li>The key describes what the attestation is about.</li>
                    <li>Example: sbvegan.interface.used:bool</li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                onChange={(e) => {
                  const key = e.target.value;
                  if (key.length > 31) {
                    setKey(key);
                    const bytesLikeKey = ethers.utils.toUtf8Bytes(key);
                    const keccak256HashedKey =
                      ethers.utils.keccak256(bytesLikeKey);
                    setHashedKey(keccak256HashedKey);
                  } else {
                    setKey(key);
                    setHashedKey('');
                  }
                }}
                placeholder="Attestation key"
                value={key}
                valid={isKeyValid}
              />
            </FormRow>

            {key.length > 31 ? (
              <FormRow>
                <FormLabel>
                  Hashed key&nbsp;
                  <Tooltip>
                    <ul>
                      <li>
                        The key in the smart contract is limited to 32 bytes.
                      </li>
                      <li>
                        When a key is 32 characters or longer, it is hashed with
                        keccack256 to fit in the 32 bytes, and this is the
                        result.
                      </li>
                      <li>
                        This will be the key recorded and used for the
                        AttestationStation.
                      </li>
                    </ul>
                  </Tooltip>
                </FormLabel>
                <HashedKey type="text" readOnly value={hashedKey} />
              </FormRow>
            ) : (
              <span />
            )}
            <FormRow>
              <FormLabel>
                Rate from 1 to 5&nbsp;
                <Tooltip>
                  <ul>
                    <li>The value that is associated with the key.</li>
                    <li>Example: true</li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Attestation value"
                onChange={(e) => setVal(e.target.value)}
                value={val}
                valid={isValValid}
              />
            </FormRow>
            <FormButton>
              <PrimaryButton
                disabled={
                  !write ||
                  isLoading ||
                  !(isAboutValid && isKeyValid && isValValid)
                }
              >
                {isLoading ? 'Making attestion' : 'Make attestation'}
              </PrimaryButton>
            </FormButton>
            {isSuccess && (
              <FeedbackMessage>
                Successfully made attestation:&nbsp;
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${etherscanBaseLink}${data?.hash}`}
                >
                  etherscan transaction
                </Link>
              </FeedbackMessage>
            )}
          </>
        ) : (
          <> </>
        )}
        {(isPrepareError || isError) && (
          <FeedbackMessage>
            Error: {(prepareError || error)?.message}
          </FeedbackMessage>
        )}
      </AttestForm>
    </>
  );
};

export default NewAttestation;
