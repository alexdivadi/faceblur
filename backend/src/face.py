class Face:
    def __init__(self, label):
        self.label: str = label
        self.detections: list[tuple] = []
    
    def add_detection(self, frame, bbox, score):
        self.detections.append((frame, bbox, score))

    def get_highest_confidence(self):
        return max(self.detections, key=lambda x: x[-1], default=None)