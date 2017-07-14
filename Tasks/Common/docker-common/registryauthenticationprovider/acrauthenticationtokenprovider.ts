"use strict";

import * as tl from "vsts-task-lib/task";
import RegistryAuthenticationToken from "./registryauthenticationtoken"
import AuthenticationTokenProvider from "./authenticationtokenprovider"

export default class ACRAuthenticationTokenProvider extends AuthenticationTokenProvider{

    // URL to registry like jitekuma-microsoft.azurecr.io
    private registryURL: string;

    // name of the azure subscription endpoint like RMDev
    private endpointName: string;

    // ACR fragment like /subscriptions/c00d16c7-6c1f-4c03-9be1-6934a4c49682/resourcegroups/jitekuma-RG/providers/Microsoft.ContainerRegistry/registries/jitekuma
    private acrFragmentUrl: string;

    constructor(endpointName?: string, registerNameValue?: string) {
        super();

        if(endpointName && registerNameValue) {
            var obj = JSON.parse(registerNameValue);
            this.registryURL = obj.loginServer;
            this.acrFragmentUrl = obj.id;
            this.endpointName = endpointName;
        }
    }
    
    public getAuthenticationToken(): RegistryAuthenticationToken
    {
        if(this.registryURL && this.endpointName) {      
            return new RegistryAuthenticationToken(tl.getEndpointAuthorizationParameter(this.endpointName, 'serviceprincipalid', true), tl.getEndpointAuthorizationParameter(this.endpointName, 'serviceprincipalkey', true), this.registryURL, "ServicePrincipal@AzureRM", "azure/vsts");
        }

        return null;
    }
}