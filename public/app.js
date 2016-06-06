angular.module('contactlistmean', []);

angular
    .module('contactlistmean')
    .controller('ContactListCtrl', ContactListCtrl);

ContactListCtrl.$inject = ['$scope', '$http'];

function ContactListCtrl($scope, $http) {
    var vm = this;
    vm.contact = {};
    vm.contacts = [];

    vm.handleError = function(response) {
        console.log(response.status + " - " + response.statusText + " - " + response.data);
    }

    vm.getAllContacts = function() {
        $http.get('/contacts').then(function(response){
            vm.contacts = response.data;
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.getAllContacts();

    vm.editMode = false;
    vm.saveContact = function() {
        if(vm.editMode) {
            vm.updateContact();
        } else {
            vm.addContact();
        }
    }

    vm.addContact = function() {
        // vm.contacts.push(vm.contact);
        console.log(vm.contact);
        $http.post('/contacts', vm.contact).then(function(response){
            console.log("After save contact" + response);
            vm.contact = {};
            vm.getAllContacts();
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.updateContact = function() {
        $http.put('/contacts/' + vm.contact._id, vm.contact).then(function(response){
            console.log("After update " + response);
            vm.contact = {};
            vm.getAllContacts();
            vm.editMode = false;
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.editContact = function(contact) {
        vm.contact = contact;
        vm.editMode = true;
    }

    vm.deleteContact = function(contactid) {
        console.log("delete " + contactid);
        $http.delete('/contacts/'+contactid).then(function(response){
            console.log("Deleted");
            vm.getAllContacts();
        }, function(response){
            vm.handleError(response);
        })
    }

    vm.cancelEdit = function() {
        vm.editMode = false;
        vm.contact = {};
    }

}
