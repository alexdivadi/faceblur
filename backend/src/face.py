class Face:
    def __init__(self, label):
        self.label = label
        self.detections = []
    
    def add_detection(self, bounding_box, frame_number, confidence):
        self.detections.append((bounding_box, frame_number, confidence))

    def get_highest_confidence(self):
        return max(self.detections, key=lambda x: x[2], default=None)