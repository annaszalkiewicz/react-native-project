import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { deletePlace } from '../store/actions/actionCreators';

class PlaceDetailsScreen extends Component {

  deletePlaceHandler = () => {
    this.props.onDeletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop({
      animated: true,
      animatioType: 'slide-horizontal'
    });
  }
  render() {

    const { selectedPlace } = this.props;

    return (
      
          <View style={styles.modalContainer}>
            <Image source={selectedPlace.image} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={this.deletePlaceHandler}>
                <View style={styles.deleteButton}>
                  <Icon
                    name="delete"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </View>
                
              </TouchableOpacity>
            </View>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  modalImage: {
    width: "100%",
    height: 200
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    margin: 20
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  deleteButton: {
    backgroundColor: '#22421D',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  closeButton: {
    backgroundColor: '#428038',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: key => dispatch(deletePlace(key))
  }
}

export default connect(null, mapDispatchToProps)(PlaceDetailsScreen);
